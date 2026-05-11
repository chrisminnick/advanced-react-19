import React from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import ConnectionManager from './ConnectionManager';
import { AuthContext } from '../provider/authProvider';

class Chat extends React.Component {
  // Class components consume context with static contextType.
  // Lab 1 students replace this with useContext (or the new use(context) hook).
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      messages: [],
      isConnected: socket.connected,
    };
    this.bottomRef = React.createRef();

    this.onConnect = this.onConnect.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    socket.on('connect', this.onConnect);
    socket.on('disconnect', this.onDisconnect);
    socket.on('message', this.receiveMessage);
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.messages !== this.state.messages) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    socket.off('connect', this.onConnect);
    socket.off('disconnect', this.onDisconnect);
    socket.off('message', this.receiveMessage);
  }

  onConnect() {
    this.setState({ isConnected: true });
  }

  onDisconnect() {
    this.setState({ isConnected: false });
  }

  receiveMessage(value) {
    // Race-prone — uses captured this.state instead of an updater function.
    // Lab 1 students should switch to setMessages(prev => [...prev, value]).
    this.setState({
      messages: [...this.state.messages, value],
    });
  }

  scrollToBottom() {
    if (this.bottomRef.current) {
      this.bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }

  sendMessage(e) {
    e.preventDefault();
    const { currentUser } = this.context;
    const { uid, photoURL } = currentUser;
    const { text } = this.state;

    socket.timeout(5000).emit('message', { text, uid, photoURL });
    this.setState({ text: '' });
  }

  render() {
    const { currentUser } = this.context;
    const { text, messages, isConnected } = this.state;

    return (
      <ChatRouteWrapper>
        {(roomId) => (
          <div className="Chat">
            <ChatHeader />
            <div className="signed-in">
              <h2 className="welcome-message">
                Hello {currentUser.displayName}. Welcome to {roomId}. You are{' '}
                {isConnected ? '' : 'not'} connected
                <span role="img" aria-label="hello">
                  👋
                </span>
                <ConnectionManager isConnected={isConnected} />
              </h2>
            </div>
            <div className="chat-messages">
              {messages &&
                messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg}
                    currentUser={currentUser}
                  />
                ))}
              <div ref={this.bottomRef} />
            </div>
            <ChatInput
              text={text}
              setText={(value) => this.setState({ text: value })}
              sendMessage={this.sendMessage}
              currentUser={currentUser}
            />
            <ChatFooter />
          </div>
        )}
      </ChatRouteWrapper>
    );
  }
}

// Route params come from a hook. Class components can't call hooks, so we
// wrap them in a function component that calls the hook and passes the value
// down via render-prop. This is the legacy pattern Lab 1 unwinds.
function ChatRouteWrapper({ children }) {
  const { roomId } = useParams() || { roomId: '1' };
  return children(roomId);
}

export default Chat;
