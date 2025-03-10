import React, { useState, useRef } from 'react';
import { Terminal, Zap, Bug, Code2, Info, BookOpen, Rocket, Upload } from 'lucide-react';
import sendMessage from "./api.js";
import {Dropdown} from 'flowbite';

function App() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");


  const handleDebug = async (event) => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(), 20000);
    event.preventDefault();
    //create a message payload
    const query = code;

    setIsAnalyzing(true);

    setStatus("Connecting to servers...")

      try{
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStatus("Analyzing code structure...");
        const data = await sendMessage(query);
        console.log(data)

        setStatus("Generating recommendations...");
        await new Promise((resolve) => setTimeout(resolve, 500));

        setMessages((prevMessages) => [
            ...prevMessages,
            {role: "User" , content: query},
            {role: "AI", content: data.content}
        ]);
        //clear the input field after sending the message
        setQuery("");
        setStatus("Completed Evalution")
    }catch(error){
        console.error("Error fetching chat resonse:", error);
    };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const Dropdown = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="neon-box py-1 w-full font px-3 rounded-md focus:outline-none"
        >
          {title}
        </button>

        {isOpen && (
          <div className="mt-1 rounded-md">
            <ul className="py-2">
              {items.map((item, index) => (
                <li key={index}>
                  <a href="#" className="block px-1 py-2">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80")',
          backgroundBlendMode: 'overlay',
        }}
      >
        <div className="absolute inset-0 bg-[#0a0b1e]/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 space-y-6">
        {/* Header */}
        <header className="neon-box py-3">
          <div className="flex items-center justify-center">
            <Terminal className="w-6 h-6 mr-2 text-cyan-400" />
            <h1 className="text-2xl font-bold neon-text">A.G.A</h1>
          </div>
        </header>

        {/* Intro Section */}
        <section className="neon-box space-y-4">
          <h2 className="text-xl font-mono text-center neon-text mb-4">Welcome to the Future of Debugging</h2>
          <div className="space-y-3 text-center">
            <p className="text-cyan-300 leading-relaxed">
              A.G.A (artificial Game Assistant) is your advanced AI-powered debugging assistant, designed to analyze, optimize, and fix code with unprecedented accuracy.
            </p>
            <p className="text-fuchsia-400/90 leading-relaxed">
              Simply paste your code or upload a file, and our AI will identify issues, suggest improvements, and provide detailed explanations for each recommendation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
              <div className="bg-cyan-500/10 rounded-lg p-3">
                <p className="text-cyan-300">✓ Detailed data</p>
              </div>
              <div className="bg-cyan-500/10 rounded-lg p-3">
                <p className="text-cyan-300">✓ Specialization in Unreal Engine 5</p>
              </div>
              <div className="bg-cyan-500/10 rounded-lg p-3">
                <p className="text-cyan-300">✓ Best Practice Suggestions</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Debug Interface */}
        <section className="flex flex-col space-y-4">
          <div className="neon-box">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span className="font-mono text-fuchsia-400">Enter code:</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs"
                />
                <button
                  onClick={handleUploadClick}
                  className="flex items-center space-x-2 px-4 py-2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 transition-colors"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-mono text-cyan-400">
                    {fileName || 'Upload File'}
                  </span>
                </button>
              </div>
            </div>
            <textarea
              value={code}
              placeholder="// Please type your code here"
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-48 bg-[#0a0b1e]/80 text-cyan-300 font-mono p-4 rounded border border-cyan-500/30 focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 outline-none resize-none"
            />
            <button
              onClick={handleDebug}
              className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-mono py-3 px-6 rounded hover:from-cyan-600 hover:to-fuchsia-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Bug className="w-5 h-5 animate-spin" />
                  <span>ANALYZING...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>ANALYZE CODE</span>
                </>
              )}
            </button>

          </div>

          {/* Output Display */}
          <div className="neon-box">
            <div className="flex items-center space-x-2 mb-4">
              <Terminal className="w-5 h-5 text-fuchsia-400" />
              <span className="font-mono text-cyan-400">Output.debug</span>
            </div>
            <div className="font-mono text-sm space-y-2">
              <p className="text-fuchsia-400">{'>'} {status} </p>
              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-cyan-300">
                  <span className="animate-pulse">▋</span>
                  <span>Processing...</span>
                </div>
              )}

                <div>
                  {
                      messages.map((message, index) => (
                          <div key={index}> 
                              <strong>{message.role}:</strong> {message.content}
                          </div>
                      ))
                  }
              </div>
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="neon-box">
            <div className="flex flex-col items-center text-center space-y-3">
              <Info className="w-8 h-8 text-cyan-400" />
              <h3 className="font-mono text-fuchsia-400">User Guide</h3>
              <p className="text-cyan-300/80">Learn how to get the most out of our debugging tools</p>
            </div>
          </div>
          <div className="neon-box">
            <div className="flex flex-col items-center text-center space-y-3">
              <BookOpen className="w-8 h-8 text-cyan-400" />
              <h3 className="font-mono text-fuchsia-400">About me</h3>
              <p className="text-cyan-300/80">Reasonings for creation</p>
            </div>
          </div>
          <div className="neon-box">
            <div className="flex flex-col items-center text-center space-y-3">
              <Rocket className="w-8 h-8 text-cyan-400" />
              <h3 className="font-mono text-fuchsia-400">Future Updates</h3>
              <p className="text-cyan-300/80">Upcoming features</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="neon-box">
          <div className="flex justify-between items-center text-xs font-mono">
            <div className="flex space-x-3">
             <Dropdown title="Contact" items={[<a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">Email</a>,<a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">Social</a>, <a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">???</a>]} />
             <Dropdown title="Resources" items={[<a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">Email</a>,<a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">Social</a>, <a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">???</a>]} />
             <Dropdown title="Legal" items={[<a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">Email</a>,<a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">Social</a>, <a href="#" className="text-cyan-400 hover:text-fuchsia-400 transition-colors">???</a>]} />
            </div>
            <span className="text-fuchsia-400">©2025</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
