import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Main } from "./components/main";

function Dashboard() {
  return (
    <div className="bg-background">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default Dashboard;
