import { ErrorMessage, Field, Form, Formik } from "formik";
import {  useRef, useState } from "react";
import "./styles.css";
import axios from "axios";
import schema from "./schema";

// mensagens de retorno para cada vez que o usuário clicar em prosseguir
const returns = {
  name: (value) => {
    return [
      {
        id: 3,
        author: "BOT",
        text: `Que satisfação, ${value}, Agora que sei seu nome, qual a cidade e estado que você mora?`,
      },
      {
        id: 4,
        author: "USER",
        waitingInput: true,
        input: {
          name: "cidade",
          placeholder: "Digite a sua cidade",
        },
      },
    ];
  },

  cidade: (value) => {
    return [
      {
        id: 5,
        author: "BOT",
        text:
          "Legal, agora que sabemos  sua cidade e estado. Quando foi que você nasceu? ",
      },

      {
        id: 6,
        author: "USER",
        waitingInput: true,
        input: {
          name: "date",
          placeholder: "00/00/000",
        },
      },
    ];
  },

  date: (value) => {
    return [
      {
        id: 7,
        author: "BOT",
        text: "Agora me fala teu email, por gentileza.? ",
      },

      {
        id: 8,
        author: "USER",
        waitingInput: true,
        input: {
          name: "email",

          placeholder: "Digite o seu email",
        },
      },
    ];
  },

  rating: (value) => {
    return [
      {
        id: 9,
        author: "BOT",
        text:
          "Você finalizou o teste Faça uma avaliação sobre o processo que realizou até chegar aqui. Nós agradecemos! ",
      },

      {
        id: 10,
        author: "USER",
        message: 
            <div className="stars">
              <input type="radio" name="star" id="star1" />
              <label htmlFor="star1">a</label>
              <input type="radio" name="star" id="star2" />
              <label htmlFor="star2"></label>
              <input type="radio" name="star" id="star3" />
              <label htmlFor="star3"></label>
              <input type="radio" name="star" id="star4" />
              <label htmlFor="star4"></label>
              <input type="radio" name="star" id="star5" />
              <label htmlFor="star5"></label>
            </div>
          
        },
      
    ];
  },
};

export default function App() {
  const [messages, setMessages] = useState(() => {
    // por default a primeira message é pra informar o nome
    return [
      {
        id: 1,
        author: "BOT",
        text:
          "Olá, eu sou Chatnilson, tudo bem? Para começarmos, preciso saber seu nome. ",
      },
      {
        id: 2,
        author: "USER",
        // esperando retorno do usuário
        waitingInput: true,
        input: {
          name: "name",
          placeholder: "Nome e sobrenome",
        },
      },
    ];
  });

  return (
    <div className="App">
      <Formik
        validationSchema={schema}
        onSubmit={(values) => {
          console.log(values);
          axios.post(
            "https://60674f6898f405001728ebe9.mockapi.io/chat",
            values
          );
        }}
        validateOnMount
        initialValues={{
          name: "",
          cidade: "",
          date: "",
          email: "",
          rating: 0,
        }}
        render={({ isValid }) => {
          return (
            <Form>
              {messages.map((message) => {
                return (
                  <Message
                    message={message}
                    setMessages={setMessages}
                    messages={messages}
                    key={message.id}
                  />
                  
                );
              })}{" "}
              
              <button type="submit" disabled={!isValid}>
                Salvar
              </button>
            </Form>
          );
        }}
      ></Formik>
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
        // https://formik.org/docs/api/field
        <Field name={message.input.name}>
          {({ meta, field }) => {
            return (
              <div className="message-input">
                {/* conforme exemplo da doc do formik: */}
                <input {...message.input} {...field} ref={inputRef} />
                <ErrorMessage name={message.input.name} />

                <button
                  // desabilita botão se form não é válido

                  onClick={() => {
                    // clicou em prosseguir, adiciona valor no array
                    const newMessages = [...messages];
                    const last = newMessages[newMessages.length - 1];
                    // substitui valores da última mensagem com o texto digitado pelo usuário
                    last.waitingInput = false;
                    last.field = last.input.name;
                    last.text = inputRef.current.value;
                    setMessages(newMessages);
                    if (last.text) {
                      // depois o bot manda a mensagem dele, conforme o campo que o usuário digitou
                      // coloquei em PT para ficar mais fácil de entender
                      const campoDigitado = message.input.name;
                      const funcaoParaExecutar = returns[campoDigitado];
                      if (!funcaoParaExecutar) {
                        // se não tem função para executar, talvez enviar o formulário para a api
                        return;
                      }
                      const novasMensagens = funcaoParaExecutar(last.text); // passando o valor pra função
                      setMessages([...newMessages, ...novasMensagens]);
                    }
                  }}
                >
                  {">"}
                </button>
              </div>
            );
          }}
        </Field>
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
