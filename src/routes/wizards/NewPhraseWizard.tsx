import React, { useState } from "react";
import { useCreatePhraseMutation } from "../../redux-api";
import { Step, Stepper } from "@mui/material";

export default function NewPhraseWizard() {
  const [activeStep, setActiveStep] = useState(0);

  const [createPhrase, { isLoading: isCreatingPhrase }] = useCreatePhraseMutation();

  const [language, setLanguage] = useState<string>("");
  const [spelling, setSpelling] = useState<string>("");

  return <div>
    <h1>Add Phrase</h1>
    {isCreatingPhrase ? "..." :
      <Stepper activeStep={activeStep}>
        <Step>
          <label htmlFor="language">Language</label>
          <input type="text" id="language" onChange={(event) => setLanguage(event.target.value)} />
          <label htmlFor="spelling">Spelling</label>
          <input type="text" id="spelling" onChange={(event) => setSpelling(event.target.value)} />
          <button onClick={() => {
            createPhrase({
              Language: language,
              Spelling: spelling,
              Creation: new Date(),
            });
            setActiveStep(1);
            // const words = spelling.match(/\b(\w+)\b/g) ?? [];
          }}>Create</button>
        </Step>
      </Stepper>}
  </div >
}