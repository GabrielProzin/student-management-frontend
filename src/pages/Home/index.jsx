import { useEffect, useState, useRef } from "react";
import "./style.css";
import api from "../../services/api";

function Home() {
  const [alunos, setUsers] = useState([]);

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  async function getAlunos() {
    const alunosFromApi = await api.get("/alunos");
    setUsers(alunosFromApi.data);
  }

  async function createAlunos() {
    await api.post("/alunos", {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
    });
    getAlunos();
  }

  async function deleteAlunos(id) {
    await api.delete(`/alunos/${id}`);
    getAlunos();
  }

  useEffect(() => {
    getAlunos();
  }, []);

  return (
    <div className="container">
      <form>
        <h1>Cadastro de Alunos</h1>
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input
          placeholder="E-mail"
          name="email"
          type="email"
          ref={inputEmail}
        />
        <button type="button" onClick={createAlunos}>
          Cadastrar
        </button>
      </form>
      {alunos.map((aluno) => (
        <div key={aluno.id} className="card">
          <div>
            <p>
              Nome: <span>{aluno.name}</span>
            </p>
            <p>
              Idade: <span>{aluno.age}</span>
            </p>
            <p>
              Email: <span>{aluno.email}</span>
            </p>
          </div>
          <button onClick={() => deleteAlunos(aluno.id)}>Excluir</button>
        </div>
      ))}
    </div>
  );
}

export default Home;
