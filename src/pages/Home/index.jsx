import { useEffect, useState, useRef } from "react";
import "./style.css";
import api from "../../services/api";

function Home() {
  const [students, setStudents] = useState([]); // Alunos carregados do banco
  const [showStudents, setShowStudents] = useState(false); // Controla exibição da lista
  const [studentsLoaded, setStudentsLoaded] = useState(false); // Marca se os alunos já foram carregados

  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  // Função para buscar alunos do banco (sem exibir automaticamente)
  async function fetchStudents() {
    try {
      const response = await api.get("/students");
      console.log("Alunos carregados: ", response.data);
      setStudents(response.data.data);
      setStudentsLoaded(true); // Marca que os alunos foram carregados
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setStudents([]);
    }
  }

  // Função para exibir a lista quando o botão for clicado
  function handleShowStudents() {
    if (!studentsLoaded) {
      fetchStudents(); // Se ainda não carregou, busca os alunos antes de exibir
    }
    setShowStudents(!showStudents); // Alterna entre mostrar/esconder a lista
  }

  // Função para criar alunos
  async function createStudent() {
    try {
      await api.post("/student", {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value,
      });

      inputName.current.value = "";
      inputAge.current.value = "";
      inputEmail.current.value = "";

      fetchStudents(); // Atualiza os alunos no banco, sem exibir automaticamente
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
    }
  }

  // Função para excluir alunos
  async function deleteStudent(id) {
    try {
      await api.delete(`/student/${id}`);
      fetchStudents();
      console.log("Aluno excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  }

  function updateStudent(id) {
    console.log("Editar aluno:", id);
    // Aqui você pode abrir um modal para edição ou navegar para outra página de edição
  }

  return (
    <div className="container">
      <form onSubmit={(e) => e.preventDefault()}>
        <h1>Cadastro de Alunos</h1>
        <input placeholder="Nome" name="nome" type="text" ref={inputName} />
        <input placeholder="Idade" name="idade" type="number" ref={inputAge} />
        <input
          placeholder="E-mail"
          name="email"
          type="email"
          ref={inputEmail}
        />
        <button type="button" onClick={createStudent}>
          Cadastrar
        </button>
        <button type="button" onClick={handleShowStudents}>
          {showStudents ? "Esconder Lista" : "Listar Alunos"}
        </button>
      </form>

      {showStudents &&
        students.length > 0 &&
        students.map((student) => (
          <div key={student.id} className="card">
            <div className="student-info">
              <p>
                <strong>Nome:</strong> <span>{student.name}</span>
              </p>
              <p>
                <strong>Idade:</strong> <span>{student.age}</span>
              </p>
              <p>
                <strong>Email:</strong> <span>{student.email}</span>
              </p>
            </div>
            <div className="buttons-container">
              <button
                className="delete-button"
                onClick={() => deleteStudent(student.id)}
              >
                Excluir
              </button>
              <button
                className="edit-button"
                onClick={() => updateStudent(student.id)}
              >
                Editar
              </button>
            </div>
          </div>
        ))}

      {showStudents && students.length === 0 && studentsLoaded && (
        <p className="empty-message">Nenhum aluno cadastrado.</p>
      )}
    </div>
  );
}

export default Home;
