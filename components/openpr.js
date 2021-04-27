import React, {useState, useEffect} from "react";
import {useCookies} from "react-cookie";
import {Alert, Row, Col, Button} from "react-bootstrap";
import {Octokit} from "@octokit/core";
import {useSession} from "next-auth/client";
import retry from "async-retry";

const START = (
  <svg width="16" height="16" style={{marginTop: "-4px"}} version="1.0">
    <circle cx="8" cy="8" r="4" fill="grey" />
  </svg>
);
const WAIT = (
  <svg
    width="16"
    height="16"
    style={{marginTop: "-4px"}}
    version="1.0"
    viewBox="0 0 128 128"
  >
    <g>
      <linearGradient id="linear-gradient">
        <stop offset="0%" stopColor="#ffffff" fillOpacity="0" />
        <stop offset="100%" stopColor="grey" fillOpacity="1" />
      </linearGradient>
      <path
        d="M63.85 0A63.85 63.85 0 1 1 0 63.85 63.85 63.85 0 0 1 63.85 0zm.65 19.5a44 44 0 1 1-44 44 44 44 0 0 1 44-44z"
        fill="url(#linear-gradient)"
        fillRule="evenodd"
      />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 64 64"
        to="360 64 64"
        dur="1200ms"
        repeatCount="indefinite"
      ></animateTransform>
    </g>
  </svg>
);
const DONE = (
  <svg
    width="16"
    height="16"
    style={{marginTop: "-4px"}}
    version="1.1"
    viewBox="0 0 16 16"
  >
    <path
      fill="#22863a"
      fillRule="evenodd"
      d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
    ></path>
  </svg>
);
const FAIL = (
  <svg
    width="16"
    height="16"
    style={{marginTop: "-4px"}}
    version="1.1"
    viewBox="0 0 16 16"
  >
    <path
      fill="#ff0000"
      fillRule="evenodd"
      d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
    ></path>
  </svg>
);

export default function Questions(props) {
  const [session, loading] = useSession();
  const [stage0, setStage0] = useState(START);
  const [stage1, setStage1] = useState(START);
  const [stage2, setStage2] = useState(START);
  const [stage3, setStage3] = useState(START);
  const [stage4, setStage4] = useState(START);
  const [submitPR, setSubmitPR] = useState(null);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState("You are almost done!");
  const [cookies, setCookie] = useCookies(["projectsReviewed"]);

  const refOwner = process.env.NEXT_PUBLIC_GITHUB_OWNER;
  const repo = process.env.NEXT_PUBLIC_GITHUB_REPO;
  const main = process.env.NEXT_PUBLIC_GITHUB_MAIN;
  const owner = session.ghUsername;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function handleClick() {
    setError(null);
    setSubmitPR(<p className="text-center pt-3">Processing...</p>);

    const octokit = new Octokit({auth: session.accessToken});
    const branchName = "review-" + (Math.random() * 10 ** 16).toString(36);

    setStage0(WAIT);
    let response;

    // First check if fork exists
    try {
      response = await octokit.request(`GET /repos/{owner}/{repo}`, {owner, repo});
    } catch (e) {
      response = null;
    }

    // Create fork if it does not yet exist
    if (!response) {
      console.log("Creating FORK");
      response = await octokit.request(`POST /repos/{owner}/{repo}/forks`, {
        owner: refOwner,
        repo,
      });

      // Forks are created asynchrously, so we wait until we get confirmation that
      // it has been created, otherwise the rest of the steps will fail.
      try {
        await retry(
          async (bail, n) => {
            const res = await await octokit.request(`GET /repos/{owner}/{repo}`, {
              owner,
              repo,
            });
          },
          {
            retries: 10,
            minTimeout: 2000,
            maxTimeout: 10000,
          }
        );
      } catch (e) {
        // After a while, we give up and abord
        setStage0(FAIL);
        setError(
          <Alert variant="danger">
            ❌&nbsp;&nbsp;Forking of {refOwner}/{repo} timed out. Wait a moment, and
            resubmit.
          </Alert>
        );
        setSubmitPR(<SubmitPR />);
        return null;
      }
    }

    setStage0(DONE);
    setStage1(WAIT);

    // Get a reference to master branch
    response = await octokit.request(`GET /repos/{owner}/{repo}/git/refs/heads/{main}`, {
      owner,
      repo,
      main,
    });

    console.log(response);

    let masterRef = null;
    if (response.status !== 200) {
      setStage1(FAIL);
    } else {
      masterRef = response.data.object.sha;
    }

    setStage1(DONE);
    setStage2(WAIT);

    // Create a new feature branch off the reference we got for master
    response = await octokit.request(`POST /repos/{owner}/{repo}/git/refs`, {
      owner,
      repo,
      ref: "refs/heads/" + branchName,
      sha: masterRef,
    });

    if (response.status !== 201) {
      setStage2(FAIL);
      setError(
        <Alert variant="danger">❌&nbsp;&nbsp;Failed to create a feature branch</Alert>
      );
      return null;
    }

    setStage2(DONE);
    setStage3(WAIT);

    const filename = props.projectName + "_" + owner + ".json";
    let fileContent = JSON.parse(JSON.stringify(props.answer)); // deep copy object
    fileContent["user"] = owner;
    fileContent["timestamp"] = parseInt(Date.now() / 1000);
    // Commit a file
    response = await octokit.request(
      `PUT /repos/{owner}/{repo}/contents/reviews/{filename}`,
      {
        owner,
        repo,
        filename,
        message: "Commit file " + filename,
        content: btoa(JSON.stringify(fileContent, null, 2) + "\n"),
        branch: branchName,
      }
    );

    console.log(response);
    if (response.status !== 201) {
      setStage3(FAIL);
      setError(<Alert variant="danger">❌&nbsp;&nbsp;Failed to commit a file</Alert>);
      return null;
    }

    setStage3(DONE);
    setStage4(WAIT);

    response = await octokit.request(`POST /repos/{owner}/{repo}/pulls`, {
      owner: refOwner,
      repo,
      title: "Add review",
      head: owner + ":" + branchName,
      base: main,
      body: "Add review from webapp",
    });

    console.log(response);

    let repoURL;
    if (response.status !== 201) {
      setStage4(FAIL);
      setError(
        <Alert variant="danger">❌&nbsp;&nbsp;Failed to open the pull request</Alert>
      );
      return null;
    } else {
      repoURL = response.data.html_url;
    }

    setStage4(DONE);
    setPageTitle("Submission Completed!");
    setSubmitPR(PrSuccess(repoURL));

    let projectsReviewed = [];
    if (cookies.projectsReviewed) {
      projectsReviewed = cookies.projectsReviewed;
    }
    projectsReviewed.push(props.projectName);
    setCookie("projectsReviewed", JSON.stringify(projectsReviewed), {
      path: "/",
      maxAge: 5184000,
    }); // maxAge: 60 days
  }

  function SubmitPR() {
    return (
      <div>
        <p className="mt-2">
          If you agree to opening a pull request to complete your submission, please click
          submit below.
        </p>
        <div className="text-center">
          <Button
            className="actionButton"
            style={{width: "80px"}}
            variant="primary"
            onClick={(e) => handleClick()}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }

  function PrSuccess(url) {
    return (
      <div className="text-center pt-3">
        <p>
          👍 <b>Thank you!</b> Your review has been submitted and this project is one step
          closer to being listed as a digital public good! You can track your submission
          here:
          <br />
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </p>
        <p>
          We would very much appreciate your feedback on how we could improve this
          validation tool through this anonymous{" "}
          <a href="https://forms.gle/GqdoVS7HheoNn8s47" target="_blank" rel="noreferrer">
            one-question form
          </a>
          . Thank you.
        </p>
        <Button className="actionButton" variant="success" href="/projects">
          Ready to do 1 more?
        </Button>
        <p className="pt-2">
          Know of any project that should a digital public good?
          <br />
          <a
            href="https://digitalpublicgoods.net/submission"
            target="_blank"
            rel="noreferrer"
          >
            Nominate it!
          </a>
        </p>
      </div>
    );
  }

  useEffect(() => {
    setSubmitPR(<SubmitPR />);
  }, []);

  return (
    <div>
      <h2 className="text-center pt-4">{pageTitle}</h2>

      <p>&nbsp;</p>

      <p>
        The final step in this process is to submit your work. Once you click the submit
        button below a pull request will be automatically opened in{" "}
        <a
          href={`https://github.com/${refOwner}/${repo}`}
          target="_blank"
          rel="noreferrer"
        >
          this repository
        </a>
        .
      </p>

      <p>This will:</p>

      <p className="mb-0">
        <span>{stage0}</span>&nbsp;Fork{" "}
        <i>
          {refOwner}/{repo}
        </i>{" "}
        into{" "}
        <i>
          {owner}/{repo}
        </i>
        <br />
        <span>{stage1}</span>&nbsp;Retrieve a reference to the <i>master</i> branch
        <br />
        <span>{stage2}</span>&nbsp;Create a feature branch
        <br />
        <span>{stage3}</span>&nbsp;Commit a new file to the feature branch
        <br />
        <span>{stage4}</span>&nbsp;Open a new pull request from the feature branch
      </p>

      {error}
      {submitPR}
    </div>
  );
}
