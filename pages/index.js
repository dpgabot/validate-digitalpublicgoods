import React, {useState, useEffect} from "react";
import {useRouter} from "next/router";
import {signIn, useSession, getSession} from "next-auth/client";
import {Button} from "react-bootstrap";

export default function Page() {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (session) {
      router.push("/projects");
    }
  }, [session]);

  return (
    <>
      <h2 style={{textAlign: "center", padding: "1em 0"}}>
        Welcome 👋 to the Digital Public Goods Alliance crowdsourcing tool!
      </h2>
      <p>
        Here, you can <b>validate digital public good submissions</b> to ultimately help
        us achieve the Sustainable Development Goals by 2030.
      </p>
      <p>
        By donating your time, you’ll help us <b>build an open source database</b> of
        digital public goods that anyone can use to create a more equitable world.{" "}
        <b>
          Read information about a nominated project, check the evidence to confirm its
          accuracy and share your review
        </b>
        . It’s that simple!
      </p>
      <p>
        In order to use this tool, you’ll need to sign in through GitHub. If you don’t
        have an account don’t worry it only takes a moment to{" "}
        <a href="https://github.com/join" target="_blank" rel="noreferrer">
          create one
        </a>
        ! This web application will use your credentials to submit your review at the end
        by opening a pull request to our repository on your behalf. This application is
        open source, and you can review the{" "}
        <a
          href="https://github.com/lacabra/validate-digitalpublicgoods"
          target="_blank"
          rel="noreferrer"
        >
          source code
        </a>{" "}
        at any time.
      </p>
      <p>
        Thank you for supporting digital public goods for a more equitable world! Ready to
        get started?
      </p>
      <div className="text-center">
        <Button
          className="actionButton"
          style={{width: "80px"}}
          variant="primary"
          onClick={(e) => {
            e.preventDefault();
            signIn("github", {callbackUrl: "/projects"});
          }}
        >
          Sign in
        </Button>
      </div>
      <p style={{fontSize: "0.7em", color: "grey", paddingTop: "2em"}}>
        *This application will request the authentication <code>public_repo</code> scope
        in order to be able to open a pull request on your behalf.
        <br /> Refer to GitHub&apos;s documentation{" "}
        <a
          href="https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/"
          target="_blank"
          rel="noreferrer"
        >
          Understanding scopes for OAuth Apps
        </a>{" "}
        for additional information.
      </p>
      <p className="footeropensource text-center">
        <a
          href="https://github.com/lacabra/validate-digitalpublicgoods"
          target="_blank"
          rel="noreferrer"
          style={{color: "#333"}}
        >
          This webapp is open source&nbsp;&nbsp;
          <svg
            height="16"
            className="octicon octicon-mark-github"
            viewBox="0 0 16 16"
            version="1.1"
            width="16"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
        </a>
      </p>
    </>
  );
}
