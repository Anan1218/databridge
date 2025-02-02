import { Container } from "../../components/Container";
import { Hero } from "../../components/homepage/Hero";
import { Features } from "../../components/homepage/Features";
import { Faq } from "../../components/homepage/Faq";

export default function Home() {
  return (
    <Container>
      <Hero />
      <Features />
      <Faq />
    </Container>
  );
}
