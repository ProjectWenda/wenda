import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loggedInState } from "../store";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = () => {
  const redirectUrl = import.meta.env.VITE_DISCORD_AUTH_REDIRECT;
  const loggedIn = useRecoilValue(loggedInState);
  const navigate = useNavigate();
  const [hoveringLogin, setHoveringLogin] = React.useState(false);

  React.useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  return (
    <div className="w-full flex items-center gap-28 flex-col">
      <div className="mt-48">
        <motion.div
          animate={{ opacity: [0, 1], scale: [0.9, 1] }}
          transition={{ type: "spring", duration: 1, bounce: 0.55 }}
        >
          <span className="text-8xl font-['Poppins'] font-semibold antialiased drop-shadow-lg">
            W
          </span>
          <span className="text-8xl font-['Poppins'] bg-clip-text bg-gradient-to-r from-disc-blue to-purple-700 text-transparent antialiased drop-shadow-lg">
            enda
          </span>
        </motion.div>
      </div>
      <motion.div
        animate={{ opacity: [0, 1] }}
        transition={{ opacity: { delay: 0.5 } }}
        whileHover={{ scale: 1.5, transition: { duration: 0.1 } }}
        onHoverStart={() => setHoveringLogin(true)}
        onHoverEnd={() => setHoveringLogin(false)}
        className="dark:bg-zinc-800 bg-zinc-200 rounded-lg w-56 h-16 flex items-center justify-center shadow-lg border-disc-blue border"
      >
        {!hoveringLogin ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-3xl font-bold dark:text-white text-black"
          >
            Login
          </motion.span>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Link to={redirectUrl}>
              <motion.div className="flex h-11 w-48 font-bold items-center justify-center gap-3 bg-disc-blue rounded-full text-white">
                <FontAwesomeIcon icon={faDiscord} bounce className="repeat-1" />
                Login w/ Discord
              </motion.div>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
