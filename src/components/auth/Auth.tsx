import React, { useState } from "react";

import { SHADOW, TEXT_GRADIENT } from "../design";
import { AuthenticationPageProps } from "../../types";
import Button from "../shared/Button";
import PasswordInput from "../shared/PasswordInput";
import TextInput from "../shared/TextInput";

export default function SignIn({ csrfToken }: AuthenticationPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      autoComplete="off"
      method="post"
      action="/api/auth/callback/credentials"
      className={` mx-auto my-8 p-4 max-w-lg flex-col rounded-2xl bg-white bg-opacity-50 dark:bg-black dark:bg-opacity-10 ${SHADOW} `}
    >
      <h1 className="text-center">
        <span className={`uppercase text-2xl font-bold ${TEXT_GRADIENT}`}>
          Authentification
        </span>
      </h1>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <div className="flex justify-center my-4">
        <label htmlFor="username">
          Nom d&apos;utilisateur
          <br />
          <TextInput
            id="username"
            name="username"
            value={username}
            setValue={setUsername}
            tabIndex={1}
          />
        </label>
      </div>
      <div className="flex justify-center my-4">
        <label htmlFor="password">
          Mot de passe
          <br />
          <PasswordInput
            id="password"
            name="password"
            value={password}
            setValue={setPassword}
            tabIndex={2}
          />
        </label>
      </div>
      <div className="flex justify-center my-4">
        <Button tabIndex={3} type="submit" variant="solid">
          Se connecter
        </Button>
      </div>
    </form>
  );
}
