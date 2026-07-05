import api from "../api/axios";
import { useState } from "react";
import { signin } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import LeftPartSignIn from "@/components/auth/LeftPartSignIn";
import RightPartSignIn from "@/components/auth/RightPartSignIn";

const SignIn = () => {
  const navigate = useNavigate();

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const handleSignin = async () => {
  try {
    setLoading(true);

    const response = await signin({
      username,
      password,
      
    });

    localStorage.setItem("token", response.token);

    alert("Login Successful!");

    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Invalid username or password");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[30%_70%]">
      <LeftPartSignIn
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleSignin={handleSignin}
        loading={loading}
      />

      
      <RightPartSignIn />
      
    </div>
  );
};

export default SignIn;