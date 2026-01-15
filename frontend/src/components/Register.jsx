import { registerUser } from "../api/auth.api";

function Register() {
  async function handleSubmit(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const user = await registerUser(email, password);
      console.log("Registered:", user);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      <input name="password" type="password" />
      <button>Register</button>
    </form>
  );
}

export default Register;
