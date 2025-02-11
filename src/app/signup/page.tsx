"use client";

import { Github, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Component() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(validatePassword(value));
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <header className="w-full p-4 flex justify-between items-center">
        <Link href="/" className="text-white">
          <Github className="w-8 h-8" />
          <span className="sr-only">v-coder</span>
        </Link>
        <div className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:text-green-800 group"
          >
            Sign in{" "}
            <ArrowRight className="inline-block w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-green-500 font-mono">
              Welcome to V-Code
            </h1>
            <p className="text-gray-400 font-mono">
              Let&apos;s begin the adventure
            </p>
          </div>
          <div className="space-y-4 font-mono">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A6E2E] to-[#1A6E2E] opacity-20 blur-lg" />
              <Input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className="w-full bg-[#0D1117] border border-gray-800 text-white px-4 py-2  focus:outline-none focus:ring-2 focus:ring-[#1A6E2E] focus:border-transparent relative"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A6E2E] to-[#1A6E2E] opacity-20 blur-lg" />
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full bg-[#0D1117] border border-gray-800 text-white px-4 py-2  focus:outline-none focus:ring-2 focus:ring-[#1A6E2E] focus:border-transparent relative"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A6E2E] to-[#1A6E2E] opacity-20 blur-lg" />
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Create a password"
                className="w-full bg-[#0D1117] border border-gray-800 text-white px-4 py-2  focus:outline-none focus:ring-2 focus:ring-[#1A6E2E] focus:border-transparent relative"
              />
            </div>
            <Button
              disabled={!name || !isValid || !isPasswordValid}
              className="w-full bg-[#1A6E2E] text-white hover:bg-[#1A6E2E]/90 font-mono relative"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4 animate-bounce-x animate-bounce-y" />
            </Button>
          </div>
          <div className="text-xs text-gray-400 space-y-4">
            <p>
              This is part of<Link href="./"> @Vinay-Kumar</Link> production
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full p-4 border-t border-gray-800">
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-gray-400">
          <Link href="#" className="hover:text-blue-300">
            Terms
          </Link>
          <Link href="#" className="hover:text-blue-300">
            Privacy
          </Link>
          <Link href="#" className="hover:text-blue-300">
            Security
          </Link>
          <Link href="#" className="hover:text-blue-300">
            Contact
          </Link>
          <span>© 2025 v-shadowmaster, Inc.</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        input::after {
          content: "|";
          margin-left: 2px;
          animation: blink 1s infinite;
        }

        @keyframes bounce-x {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(3px);
          }
        }

        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
}
