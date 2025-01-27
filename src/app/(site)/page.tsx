import { Container } from "../../components/Container";
import { Hero } from "../../components/homepage/Hero";
import { SectionTitle } from "../../components/homepage/SectionTitle";
import { Faq } from "../../components/homepage/Faq";
import { Features } from "../../components/homepage/Features";

export default function Home() {
  return (
    <Container>
      <Hero />
      <Features />
      <SectionTitle 
        preTitle="FAQ" 
        title="Got Questions?"
      >
        Learn more about how DataBridge works and how you can get the most out of it.
      </SectionTitle>
      <Faq />
    </Container>
  );
}
