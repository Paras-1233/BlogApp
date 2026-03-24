import MainLayout from "../layouts/MainLayout";

const Login = () => {
  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Login
          </h2>

          <form className="space-y-4">
            
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              Login
            </button>

          </form>

        </div>
      </div>
    </MainLayout>
  );
};

export default Login;