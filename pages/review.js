import React, {useState, useEffect} from "react";
import {signIn, signOut, useSession} from "next-auth/client";
import {Button, Spinner, Alert} from "react-bootstrap";
import Layout from "../components/layout";
import Questions from "../components/questions";
import Summary from "../components/summary";
import OpenPR from "../components/openpr";

const MIN_LENGTH = 50;

const SDGS = [
  "No Poverty",
  "Zero Hunger",
  "Good Health and Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water and Sanitation",
  "Affordable and Clean Energy",
  "Decent Work and Economic Growth",
  "Industry, Innovation and Infrastructure",
  "Reduced Inequality",
  "Sustainable Cities and Communities",
  "Responsible Consumption and Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace and Justice Strong Institutions",
  "Partnerships to achieve the Goal",
];

const SDGLinks = [
  "https://www.un.org/sustainabledevelopment/poverty/",
  "https://www.un.org/sustainabledevelopment/hunger/",
  "https://www.un.org/sustainabledevelopment/health/",
  "https://www.un.org/sustainabledevelopment/health/",
  "https://www.un.org/sustainabledevelopment/education/",
  "https://www.un.org/sustainabledevelopment/water-and-sanitation/",
  "https://www.un.org/sustainabledevelopment/energy/",
  "https://www.un.org/sustainabledevelopment/economic-growth/",
  "https://www.un.org/sustainabledevelopment/infrastructure-industrialization/",
  "https://www.un.org/sustainabledevelopment/inequality",
  "https://www.un.org/sustainabledevelopment/cities",
  "https://www.un.org/sustainabledevelopment/sustainable-consumption-production",
  "https://www.un.org/sustainabledevelopment/climate-change",
  "https://www.un.org/sustainabledevelopment/oceans",
  "https://www.un.org/sustainabledevelopment/biodiversity",
  "https://www.un.org/sustainabledevelopment/peace-justice",
  "https://www.un.org/sustainabledevelopment/globalpartnerships",
];

const licenses = {
  "CC-BY-1.0": "Creative Commons Attribution 1.0 Generic",
  "CC-BY-2.0": "Creative Commons Attribution 2.0 Generic",
  "CC-BY-2.5": "Creative Commons Attribution 2.5 Generic",
  "CC-BY-3.0": "Creative Commons Attribution 3.0 Unported",
  "CC-BY-3.0-AT": "Creative Commons Attribution 3.0 Austria",
  "CC-BY-4.0": "Creative Commons Attribution 4.0 International",
  "CC-BY-NC-1.0": "Creative Commons Attribution Non Commercial 1.0 Generic",
  "CC-BY-NC-2.0": "Creative Commons Attribution Non Commercial 2.0 Generic",
  "CC-BY-NC-2.5": "Creative Commons Attribution Non Commercial 2.5 Generic",
  "CC-BY-NC-3.0": "Creative Commons Attribution Non Commercial 3.0 Unported",
  "CC-BY-NC-4.0": "Creative Commons Attribution Non Commercial 4.0 International",
  "CC-BY-NC-SA-1.0":
    "Creative Commons Attribution Non Commercial Share Alike 1.0 Generic",
  "CC-BY-NC-SA-2.0":
    "Creative Commons Attribution Non Commercial Share Alike 2.0 Generic",
  "CC-BY-NC-SA-2.5":
    "Creative Commons Attribution Non Commercial Share Alike 2.5 Generic",
  "CC-BY-NC-SA-3.0":
    "Creative Commons Attribution Non Commercial Share Alike 3.0 Unported",
  "CC-BY-NC-SA-4.0":
    "Creative Commons Attribution Non Commercial Share Alike 4.0 International",
  "CC-BY-SA-1.0": "Creative Commons Attribution Share Alike 1.0 Generic",
  "CC-BY-SA-2.0": "Creative Commons Attribution Share Alike 2.0 Generic",
  "CC-BY-SA-2.5": "Creative Commons Attribution Share Alike 2.5 Generic",
  "CC-BY-SA-3.0": "Creative Commons Attribution Share Alike 3.0 Unported",
  "CC-BY-SA-3.0-AT": "Creative Commons Attribution Share Alike 3.0 Austria",
  "CC-BY-SA-4.0": "Creative Commons Attribution Share Alike 4.0 International",
  "CC0-1.0": "Creative Commons Zero v1.0 Universal",
  "ODbL-1.0": "Open Data Commons Open Database License 1.0",
  "ODC-By-1.0": "Open Data Commons Attribution License 1.0",
  "PDDL-1.0": "Open Data Commons Public Domain Dedication and Licence 1.0",
  "0BSD": "0-clause BSD License",
  AAL: "Attribution Assurance License",
  "AFL-3.0": "Academic Free License 3.0",
  "AGPL-3.0": "GNU Affero General Public License version 3",
  "Apache-1.1": "Apache Software License 1.1",
  "Apache-2.0": "Apache License 2.0",
  "APL-1.0": "Adaptive Public License",
  "APSL-2.0": "Apple Public Source License",
  "Artistic-1.0": "Artistic license 1.0",
  "Artistic-2.0": "Artistic License 2.0",
  "BSD-1-Clause": "1-clause BSD License",
  "BSD-2-Clause": "2-clause BSD License",
  "BSD-2-Clause-Patent": "BSD+Patent",
  "BSD-3-Clause": "3-clause BSD License",
  "BSD-3-Clause-LBNL": "BSD-3-Clause-LBNL",
  "BSL-1.0": "Boost Software License",
  "CAL-1.0": "Cryptographic Autonomy License v.1.0",
  "CAL-1.0-Combined-Work-Exception": "Cryptographic Autonomy License v.1.0",
  "CATOSL-1.1": "Computer Associates Trusted Open Source License 1.1",
  "CDDL-1.0": "Common Development and Distribution License 1.0",
  "CECILL-2.1": "CeCILL License 2.1",
  "CNRI-Python": "CNRI Python license",
  "CPAL-1.0": "Common Public Attribution License 1.0",
  "CPL-1.0": "Common Public License 1.0",
  "ECL-1.0": "Educational Community License, Version 1.0",
  "ECL-2.0": "Educational Community License, Version 2.0",
  "EFL-1.0": "Eiffel Forum License V1.0",
  "EFL-2.0": "Eiffel Forum License V2.0",
  Entessa: "Entessa Public License",
  "EPL-1.0": "Eclipse Public License 1.0",
  "EPL-2.0": "Eclipse Public License 2.0",
  EUDatagrid: "EU DataGrid Software License",
  "EUPL-1.2": "European Union Public License 1.2",
  Fair: "Fair License",
  "Frameworx-1.0": "Frameworx License",
  "GPL-2.0": "GNU General Public License version 2",
  "GPL-3.0": "GNU General Public License version 3",
  HPND: "Historical Permission Notice and Disclaimer",
  IPA: "IPA Font License",
  "IPL-1.0": "IBM Public License 1.0",
  ISC: "ISC License",
  "LGPL-2.1": "GNU Lesser General Public License version 2.1",
  "LGPL-3.0": "GNU Lesser General Public License version 3",
  "LiLiQ-P-1.1": "Licence Libre du Québec – Permissive",
  "LiLiQ-R-1.1": "Licence Libre du Québec – Réciprocité",
  "LiLiQ-Rplus-1.1": "Licence Libre du Québec – Réciprocité forte",
  "LPL-1.0": "Lucent Public License",
  "LPL-1.02": "Lucent Public License Version 1.02",
  "LPPL-1.3c": "LaTeX Project Public License 1.3c",
  MirOS: "MirOS Licence",
  MIT: "MIT License",
  "MIT-0": "MIT No Attribution License",
  Motosoto: "Motosoto License",
  "MPL-1.0": "Mozilla Public License 1.0",
  "MPL-1.1": "Mozilla Public License 1.1",
  "MPL-2.0": "Mozilla Public License 2.0",
  "MPL-2.0-no-copyleft-exception": "Mozilla Public License 2.0, no copyleft exception",
  "MS-PL": "Microsoft Public License",
  "MS-RL": "Microsoft Reciprocal License",
  "MulanPSL-2.0": "Mulan Permissive Software License v2",
  Multics: "Multics License",
  "NASA-1.3": "NASA Open Source Agreement 1.3",
  Naumen: "Naumen Public License",
  NCSA: "University of Illinois/NCSA Open Source License",
  NGPL: "Nethack General Public License",
  Nokia: "Nokia Open Source License",
  "NPOSL-3.0": "Non-Profit Open Software License 3.0",
  NTP: "NTP License",
  "OCLC-2.0": "OCLC Research Public License 2.0",
  "OFL-1.1": "SIL Open Font License 1.1",
  "OFL-1.1-no-RFN": "SIL Open Font License 1.1",
  "OFL-1.1-RFN": "SIL Open Font License 1.1",
  OGTSL: "Open Group Test Suite License",
  "OLDAP-2.8": "OpenLDAP Public License Version 2.8",
  "OSET-PL-2.1": "OSET Public License version 2.1",
  "OSL-1.0": "Open Software License 1.0",
  "OSL-2.1": "Open Software License 2.1",
  "OSL-3.0": "Open Software License 3.0",
  "PHP-3.0": "PHP License 3.0",
  "PHP-3.01": "PHP License 3.01",
  PostgreSQL: "The PostgreSQL License",
  "Python-2.0": "Python License",
  "QPL-1.0": "Q Public License",
  "RPL-1.1": "Reciprocal Public License, version 1.1",
  "RPL-1.5": "Reciprocal Public License 1.5",
  "RPSL-1.0": "RealNetworks Public Source License V1.0",
  RSCPL: "Ricoh Source Code Public License",
  "SimPL-2.0": "Simple Public License 2.0",
  Sleepycat: "Sleepycat License",
  "SPL-1.0": "Sun Public License 1.0",
  "UCL-1.0": "Upstream Compatibility License v1.0",
  "Unicode-DFS-2015": "Unicode Data Files and Software License",
  "Unicode-DFS-2016": "Unicode Data Files and Software License",
  Unlicense: "The Unlicense",
  "UPL-1.0": "Universal Permissive License",
  "VSL-1.0": "Vovida Software License v. 1.0",
  W3C: "W3C License",
  "Watcom-1.0": "Sybase Open Watcom Public License 1.0",
  Xnet: "X.Net License",
  wxWindows: "wxWindows Library License",
  Zlib: "zlib/libpng license",
  "ZPL-2.0": "Zope Public License 2.0",
};

export default function Review(props) {
  const [session, loading] = useSession();

  const [counter, setCounter] = useState(0);
  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [result, setResult] = useState({});

  function countComment() {
    // function to get number of meaningful comments
    var number = 0;
    Object.values(result).map((ans) => {
      if (ans.comment.length >= MIN_LENGTH) {
        number++;
      }
    });
    return number;
  }

  function handleAnswer(answer, next) {
    result[question.item] = answer;
    setResult(result);

    if (next) {
      if (counter < questions.length) {
        setQuestion(questions[counter + 1]);
        setCounter(counter + 1);
      }
    } else {
      if (counter > 0) {
        setQuestion(questions[counter - 1]);
        setCounter(counter - 1);
      }
    }
  }

  function handleConfirm() {
    setCounter(counter + 1);
  }

  function thisLink(text) {
    let output;
    if (text) {
      const url = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      output = text.replace(
        url,
        "<a href='$1' target='_blank' class='emphasis'>this link</a>"
      );
      output = output.replace(/(?:\r\n|\r|\n)/g, "<br>");
    } else {
      output = '<span class="emphasis">no link</span>';
    }
    return output;
  }

  function thisLinkList(text) {
    let output;
    if (text) {
      const array = text.split(/[\n\s,]+/);
      const parsedText = array.join(", ").replace(/, ((?:.(?!, ))+)$/, " and $1");
      const url = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      output = parsedText.replace(
        url,
        "<a href='$1' target='_blank' class='emphasis'>this link</a>"
      );
      output = output.replace(/(?:\r\n|\r|\n)/g, "<br>");
    } else {
      output = '<span class="emphasis">no link</span>';
    }
    return output;
  }

  function parseURLs(text) {
    let output;
    if (text) {
      const url = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      output = text.replace(url, "<a href='$1' target='_blank' class='emphasis'>$1</a>");
      output = output.replace(/(?:\r\n|\r|\n)/g, "<br>");
    } else {
      output = '<span class="emphasis">no link</span>';
    }
    return output;
  }

  useEffect(() => {
    const obj = props.submission;

    let rs = [];

    for (let i = 0; i < obj.license.length; i++) {
      const o = {
        item: "license",
        text: `The project owner claims that ${
          obj.name
        } is licensed under a <span class="emphasis">${licenses[obj.license[i].spdx]} (${
          obj.license[i].spdx
        }) license</span> and provided ${thisLink(
          obj.license[i].licenseURL
        )} to the license.`,
        question: `Does ${thisLink(
          obj.license[i].licenseURL
        )} point to a <span class="emphasis">${obj.license[i].spdx} license</span>?`,
      };
      rs.push(o);
    }

    for (let i = 0; i < obj.SDGs.length; i++) {
      let text = `The project owner claims that ${obj.name} is relevant to <a href="${
        SDGLinks[obj.SDGs[i].SDGNumber - 1]
      }" target="_blank"><span class="emphasis">SDG ${obj.SDGs[i].SDGNumber}: ${
        SDGS[obj.SDGs[i].SDGNumber - 1]
      }</span></a>, `;
      if (obj.SDGs[i].evidenceText) {
        if (obj.SDGs[i].evidenceURL) {
          text += `and provided both ${thisLink(
            obj.SDGs[i].evidenceURL
          )}, and this text: <blockquote>${obj.SDGs[i].evidenceText}</blockquote>`;
        } else {
          text += `and provided this evidence: <blockquote>${obj.SDGs[i].evidenceText}</blockquote>`;
        }
      } else {
        text += `and provided ${thisLink(obj.SDGs[i].evidenceURL)}`;
      }
      const o = {
        item: `SDG[${i}]`,
        text: text,
        question: `Does the evidence provided justify their relevance to <a href="${
          SDGLinks[obj.SDGs[i].SDGNumber - 1]
        }" target="_blank"><span class="emphasis">SDG ${
          obj.SDGs[i].SDGNumber
        }</span></a>? Specifically, does this project advance some of the specific targets listed for <a href="${
          SDGLinks[obj.SDGs[i].SDGNumber - 1]
        }" target="_blank"><span class="emphasis">Goal ${
          obj.SDGs[i].SDGNumber
        }</span></a>?`,
      };
      rs.push(o);
    }

    if (obj.clearOwnership.isOwnershipExplicit === "Yes") {
      let owner = {
        item: "clearOwnership",
        text: `The project owner for ${
          obj.name
        } claims that ownership of the project and everything that the project produces is clearly defined and documented, and provides ${thisLinkList(
          obj.clearOwnership.copyrightURL
        )} as supporting evidence.`,
        question: `Does the evidence provided support the above claim?`,
      };
      rs.push(owner);
    }

    if (
      obj.platformIndependence.mandatoryDepsCreateMoreRestrictions === "Yes" &&
      obj.platformIndependence.isSoftwarePltIndependent === "Yes"
    ) {
      let deps = {
        item: "platformIndependence",
        text: `The project owner for ${
          obj.name
        } claims that (a) despite the fact that this open project has mandatory dependencies (i.e. libraries, hardware) that create more restrictions than the original license, and (b) the open source components are able to demonstrate independence from the closed component(s) and/or there are functional, open alternatives. The project owner provides the following evidence to support this claim: <blockquote>${parseURLs(
          obj.platformIndependence.pltIndependenceDesc
        )}</blockquote>`,
        question: `Does the evidence provided support the above claim?`,
      };
    }

    if (obj.documentation.isDocumentationAvailable === "Yes") {
      let links = "<ul>";
      for (let i = 0; i < obj.documentation.documentationURL.length; i++) {
        links += `<li>${parseURLs(obj.documentation.documentationURL[i])}</li>`;
      }
      links += "</ul>";
      let doc = {
        item: "documentation",
        text: `The project owner for ${obj.name} puts forward the following URL(s) as the project documentation: ${links}.`,
        question: `Does the documentation provided satisfy the following criteria?<br/><ul><li>For <b>software</b> projects, this should present technical documentation that would allow a technical person unfamiliar with the project to launch and run the software.</li><li>For <b>data</b> projects, this should present documentation that describes all the fields in the set, and provides context on how the data was collected and how it should be interpreted.</li><li>For <b>content</b>, this should indicate any relevant compatible apps, software, or hardware required to access the content and any instructions about how to use it.</li></ul>`,
      };
      rs.push(doc);
    }

    if (
      obj.NonPII.collectsNonPII === "Yes" &&
      obj.NonPII.checkNonPIIAccessMechanism === "Yes"
    ) {
      let nonPII = {
        item: "nonPII",
        text: `The project owner for ${
          obj.name
        } reports that (a) the project collects or uses non-personally identifiable information (non-PII) data, and (b) there is a mechanism for extracting or importing non-PII data from the system in a non-proprietary format. They describe such mechanism as follows: <blockquote>${parseURLs(
          obj.NonPII.nonPIIAccessMechanism
        )}</blockquote>`,
        question: `Is there enough evidence in the above description to reasonably assert that non-PII data can be imported or exported in a non-proprietary format?`,
      };
      rs.push(nonPII);
    }

    setQuestions(rs);
    setQuestion(rs[0]);
  }, []);

  if (questions) {
    return (
      <Layout
        progress={(counter / questions.length) * 100}
        label={`${Math.round((counter / questions.length) * 100)}%`}
      >
        {counter < questions.length && (
          <>
            <Alert variant="info" className="text-center mt-3">
              You are reviewing{" "}
              <a href={props.submission.website} target="_blank" rel="noreferrer">
                {props.submission.name}
              </a>
            </Alert>
            <Questions
              data={question}
              counter={counter + 1}
              total={questions.length}
              onAnswer={handleAnswer}
              mode={false}
              result={result[question.item] ? result[question.item] : null}
              count={countComment()}
            />
          </>
        )}

        {counter == questions.length && (
          <>
            <Alert variant="info" className="text-center mt-3">
              You are reviewing{" "}
              <a href={props.submission.website} target="_blank" rel="noreferrer">
                {props.submission.name}
              </a>
            </Alert>
            <h4 className="text-center pt-1 pb-3">This is what we got from you!</h4>
            {questions.map((object, index) => (
              <Summary
                key={index}
                index={index}
                question={questions[index]}
                total={questions.length}
                onAnswer={handleAnswer}
                result={result[questions[index].item]}
              />
            ))}
            <div className="text-center pb-3">
              <Button
                className="actionButton"
                style={{width: "80px"}}
                variant="primary"
                onClick={(e) => handleConfirm()}
              >
                Confirm
              </Button>
            </div>
          </>
        )}
        {counter >= questions.length + 1 && (
          <OpenPR
            answer={result}
            projectName={props.submission.name}
            startTime={props.startTime}
          />
        )}
      </Layout>
    );
  } else {
    return (
      <Spinner animation="border" role="status" className="mt-5 mb-5">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
}
