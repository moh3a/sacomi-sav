import { Fragment, ReactNode, useState } from "react";

import Button from "./Button";

interface StepperProps {
  stages: {
    title: string;
    icon: ReactNode;
    children: ReactNode;
  }[];
}

const Stepper = ({ stages }: StepperProps) => {
  const [step, setStep] = useState(0);

  return (
    <div className="p-5">
      <div className="mx-4 p-4">
        <div className="flex items-center">
          {stages.map((stage, index) => (
            <Fragment key={index}>
              <div
                className={`flex items-center relative ${
                  index < step
                    ? "text-primary"
                    : index > step
                    ? "text-gray-500"
                    : "text-white"
                }`}
              >
                <div
                  className={`flex justify-center rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 ${
                    index < step
                      ? "border-primary"
                      : index > step
                      ? "border-gray-300"
                      : "border-primary bg-primary"
                  }`}
                >
                  {stage.icon}
                </div>
                <div
                  className={`absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase ${
                    index > step ? "text-gray-500" : "text-primary"
                  }`}
                >
                  {stage.title}
                </div>
              </div>
              {stages.length - 1 !== index && (
                <div
                  className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                    index < step ? "border-primary" : "border-gray-300"
                  }`}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mt-8 p-4">
        {stages[step].children}
        <div className="flex p-2 mt-4">
          {step !== 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Précédent
            </Button>
          )}
          <div className="flex-auto flex flex-row-reverse">
            {step < stages.length - 1 && (
              <Button variant="solid" onClick={() => setStep(step + 1)}>
                Suivant
              </Button>
            )}
            {step === stages.length - 1 && (
              <Button variant="solid">Terminer</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;
