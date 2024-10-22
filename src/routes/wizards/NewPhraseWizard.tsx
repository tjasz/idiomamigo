import React, { useState } from "react";
import { useCreatePhraseMembershipMutation, useCreatePhraseMutation, useCreateWordMutation } from "../../redux-api";
import { Step, Stepper } from "@mui/material";
import { Phrase } from "../../types";

export default function NewPhraseWizard() {
  const [activeStep, setActiveStep] = useState(0);

  const [createPhrase, { isLoading: isCreatingPhrase }] = useCreatePhraseMutation();
  const [createWord, { isLoading: isCreatingWord }] = useCreateWordMutation();
  const [createPhraseMembership, { isLoading: isCreatingPhraseMembership }] = useCreatePhraseMembershipMutation();

  const [language, setLanguage] = useState<string>("");
  const [spelling, setSpelling] = useState<string>("");
  const [phrase, setPhrase] = useState<Phrase | undefined>(undefined);

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
            }).then(result => {
              console.log(result)
              if (result.data) {
                setPhrase(result.data);
                const words = spelling.match(/\b(\w+)\b/g) ?? [];
                console.log(words)
                for (var word of words) {
                  createWord({
                    Language: language,
                    Spelling: word,
                    Creation: new Date(),
                  }).then(wordResult => {
                    console.log(wordResult)
                    if (wordResult.data) {
                      createPhraseMembership({
                        Word: wordResult.data.Id,
                        Phrase: result.data.Id,
                        Creation: new Date(),
                      })
                    }
                  })
                }
              }
            });
            setActiveStep(1);
          }}>Create</button>
        </Step>
        <Step>

        </Step>
      </Stepper>}
  </div >
}