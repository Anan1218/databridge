'use client';

import { useState } from 'react';
import { Container } from "../../components/Container";
import { Hero } from "../../components/homepage/Hero";
import { Features } from "../../components/homepage/Features";
import { Faq } from "../../components/homepage/Faq";
import LoginModal from "../../components/LoginModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container>
      <Hero openModal={() => setIsModalOpen(true)} />
      <Features openModal={() => setIsModalOpen(true)} />
      <Faq openModal={() => setIsModalOpen(true)} />
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Container>
  );
}
