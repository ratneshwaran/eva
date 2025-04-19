import ChatInterface from './components/Chat/ChatInterface';

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}