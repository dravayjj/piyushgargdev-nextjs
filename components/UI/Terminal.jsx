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
        {/* ✅ REMOVED: the white <h2>Terminal</h2> inside the box is gone */}

        <div
          className="terminal-window"
          style={{
            marginTop: "32px",             // ✅ NEW: gap between the green "Terminal" heading and the box
            border: "1px solid #fff",
            padding: "12px 16px",          // ✅ CHANGED: small padding so content sits close to the corner
            display: "flex",
            justifyContent: "flex-start",  // ✅ CHANGED: content stays on the left
            alignItems: "flex-start",      // ✅ CHANGED: content stays at the top (upper-left corner)
            textAlign: "left",
            minHeight: "300px",            // ✅ NEW: keeps the box tall while the content stays at the top
          }}
        >
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
