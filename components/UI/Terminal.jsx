import React from "react";
import { ReactTerminal, TerminalContextProvider } from "react-terminal";
import { signIn, signOut, useSession } from "next-auth/react";

const Terminal = () => {
  const { data } = useSession();

  const isLoggedIn = React.useMemo(
    () => Boolean(data && data.user),
    [data]
  );

  const terminalCommands = React.useMemo(() => {
    return {
      whoami: {
        help: "Tells you who are you",
        action: isLoggedIn ? (
          `${data.user.name} <${data.user.email}>`
        ) : (
          <div>
            <p>You need to be signed in to use this command!</p>
            <span style={{ color: "#38CC77" }}>
              Just type `sign-in`
            </span>
          </div>
        ),
      },

      "sign-in": {
        help: "Redirects you to the login page",
        action: isLoggedIn ? (
          <div>
            <p>You Are Already Signed In</p>
          </div>
        ) : (
          signIn
        ),
      },

      "sign-out": {
        help: "Sign out the current user",
        action: !isLoggedIn ? (
          <div>
            <p>You need to be signed in to use this command!</p>
            <span style={{ color: "#38CC77" }}>
              Just type `sign-in`
            </span>
          </div>
        ) : (
          signOut
        ),
      },

      "get-location": {
        help: "Gets your current location",
        action: async () =>
          new Promise((resolve) =>
            navigator.geolocation.getCurrentPosition(
              (pos) =>
                resolve(
                  `Your current position is ${pos.coords.latitude}, ${pos.coords.longitude}`
                ),
              (error) => resolve(`Error: ${error.message}`)
            )
          ),
      },
    };
  }, [data?.user?.email, data?.user?.name, isLoggedIn]);

  return (
    <TerminalContextProvider>
      <section className="terminal-section">
        {/* ✅ CHANGED: marginBottom 12px -> 32px (bigger gap between heading and box) */}
        <h2
          className="terminal-heading"
          style={{ marginBottom: "32px" }} // ✅ CHANGED
        >
          Terminal
        </h2>

        {/* ✅ NEW: border, padding and left alignment for the box */}
        <div
          className="terminal-window"
          style={{
            border: "1px solid #fff",       // ✅ NEW
            padding: "40px 32px",           // ✅ NEW: space between border and content
            display: "flex",                // ✅ NEW
            justifyContent: "flex-start",   // ✅ NEW: group sits on the left
            alignItems: "center",           // ✅ NEW
            textAlign: "left",              // ✅ NEW
          }}
        >
          {/* ✅ NEW: wrapper keeps the whole text group together on the left */}
          <div style={{ width: "100%", textAlign: "left" }}>
            <ReactTerminal
              prompt={
                data && data.user
                  ? `$ ${data.user.name} >> `
                  : "$ piyushgarg-dev >> "
              }
              welcomeMessage={
                <div>
                  <p>
                    Welcome to my website! Get started by typing `help`
                    command below
                  </p>
                </div>
              }
              themes={{
                darkDefault: {
                  themeBGColor: "",
                  themeToolbarColor: "",
                  themeColor: "#38CC77",
                  themePromptColor: "#fff",
                },
              }}
              theme="darkDefault"
              commands={{
                ...Object.keys(terminalCommands).reduce(
                  (commands, key) => ({
                    ...commands,
                    [key]: terminalCommands[key].action,
                  }),
                  {}
                ),
                help: (
                  <div style={{ marginTop: "5px" }}>
                    <p>Available Commands:</p>

                    {Object.keys(terminalCommands).map((key) => (
                      <p key={key}>
                        <span style={{ color: "#38CC77" }}>
                          {key}:
                        </span>{" "}
                        {terminalCommands[key].help}
                      </p>
                    ))}

                    <p>
                      <span style={{ color: "#38CC77" }}>clear:</span>{" "}
                      clears out everything on screen!
                    </p>
                  </div>
                ),
              }}
            />
          </div>
        </div>
      </section>
    </TerminalContextProvider>
  );
};

export default Terminal;
