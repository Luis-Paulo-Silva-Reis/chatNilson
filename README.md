import { useEffect, useRef, useState } from "react";
import "./styles.css";

export default function App() {
  const [messages, setMessages] = useState(() => {
    // por default a primeira message é pra informar o nome
    return [
      {
        id: 1,
        author: "USER",
        // esperando retorno do usuário
        waitingInput: true,
        input: {
          name: "name",
          placeholder: "Nome e sobrenome"
        }
      }
    ];
  });

  return (
    <div className="App">
      {messages.map((message) => {
        return (
          <Message
            message={message}
            setMessages={setMessages}
            messages={messages}
          />
        );
      })}
    </div>
  );
}

function Message({ message, messages, setMessages }) {
  // componente para renderizar a mensagem
  let content = null;
  let classNames = "message ";

  const inputRef = useRef();

  if (message.author === "USER") {
    // se for user, adiciona classe "user-message".
    classNames += "user-message";
    if (message.waitingInput && message.input) {
      //  Se tiver input, renderia o input com botão para prosseguir
      content = (
        <div className="message-input">
          <input {...message.input} ref={inputRef} />
          <button
            onClick={() => {
              // clicou em prosseguir, adiciona valor no array
              const newMessages = [...messages];
              const last = newMessages[newMessages.length - 1];
              // substitui valores da última mensagem com o texto digitado pelo usuário
              last.waitingInput = false;
              last.field = last.input.name;
              last.input = null;
              last.text = inputRef.current.value;
              setMessages(newMessages);
              if (last.text) {
                // depois o bot manda a mensagem dele
                setMessages([
                  ...newMessages,
                  {
                    author: "BOT",
                    text: "Que satisfação...."
                  }
                ]);
                /* 
                  ao final de tudo, é possível mandar os valores digitados pelo usuário para a api:
                  messages.filter(message => message.author === 'USER' && message.field).map(message => ({ field: message.field, value: message.text  }))
                  isso iria retornar:
                  [{
                    field: "name",
                    value: "Joaozinho"
                  }, {
                    field: "cidade",
                    value: "São paulo"
                  }]
                  no final, poderia converter isso em algo assim:
                  {
                    name: "Joaozinho",
                    cidade: "São paulo"
                  }
                */
              }
            }}
          >
            {">"}
          </button>
        </div>
      );
    } else {
      //  Se não apenas mostra a mensagem do usuário
      content = <div>{message.text}</div>;
    }
  } else {
    classNames += "bot-message";
    content = <div>{message.text}</div>;
  }

  return <div className={classNames}>{content}</div>;
}

// ************
.App {
  font-family: sans-serif;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.message {
  background-color: white;
  border: 1px solid black;
}

.message-input {
  display: flex;
  flex-direction: row;
  text-align: right;
  align-self: flex-end;
}

.bot-message {
  background-color: green;
  color: white;
}

.user-message {
  background-color: gray;
  color: black;
}
