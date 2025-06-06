import React, {useActionState} from "react";
import "./LoginPage.css";
import {Link} from "react-router";

interface ILoginPageProps {
    isRegistering: boolean
    changeToken: (token: string) => void
}


export function LoginPage(props: ILoginPageProps) {
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();

    async function authRequest(to: string, username: string, password: string) {
        const res = await fetch(to, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        })

        if (!res.ok) {
            const errBody = await res.json()
            throw new Error(`${res.status} ${errBody.error}: ${errBody.message}`)
        }
        return res.text()
    }

    const [result, submitAction, isPending] = useActionState(
        async (_previousState: { type: string; message: string } | null, formData: FormData) => {
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;

            if (!username || !password) {
                return {
                    type: "error",
                    message: "Please fill in your username and password",
                };
            }

            try {
                const to = props.isRegistering ? "/auth/register" : "/auth/login"
                const res = await authRequest(to, username, password)

                if (props.isRegistering) {
                    props.changeToken(res);
                    return {
                        type: "success",
                        message: "Successfully registered account"
                    }
                }
                else {
                    props.changeToken(res);
                    return {
                        type: "success",
                        message: "Successfully logged in"
                    }
                }

            }
            catch (err) {
                console.error("Error", err)
                const errMsg = err as Error;
                return {
                    type: "error",
                    message: errMsg.message
                }
            }
            },
            null
        );

    return (
        <div>
            <h2>{props.isRegistering ? "Register a new account" : "Login"}</h2>
            <form action={submitAction} className="LoginPage-form">
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} required={true} disabled={isPending} name="username"/>

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} required={true} disabled={isPending} type="password" name="password"/>

                <input type="submit" value="Submit" disabled={isPending}/>
            </form>

            {result?.type === "error" ?
                <div id="announce" className="error" aria-live="polite">
                    {result.message}
                </div> : ""}

            {!props.isRegistering ?
                <div>
                    Don't have an account?
                    <Link to="/register"> Register here </Link>
                </div>
                : ""}
        </div>
    );
}
