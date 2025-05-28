// App.tsx
import { useEffect, useState } from 'react';
import AddProductForm from './components/AddProductForm';
import "./App.css"

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  quantidade: number;
  preco: number;
}

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const buscarProdutos = async () => {
    try {
      const resposta = await fetch('http://54.146.151.102:8000/produtos');
      
      if (!resposta.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      
      const dados = await resposta.json();
      setProdutos(dados);
      setErro('');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const handleDeletar = async (id: string) => {
    try {
      const confirmacao = window.confirm('Tem certeza que deseja excluir este produto?');
      if (!confirmacao) return;

      const resposta = await fetch(`http://54.146.151.102:8000/produtos/${id}`, {
        method: 'DELETE'
      });

      if (!resposta.ok) throw new Error('Erro ao excluir');
      
      await buscarProdutos();
      alert('Produto excluído com sucesso!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  const handleEditar = async (produto: Produto) => {
    const novoNome = prompt('Novo nome:', produto.nome);
    const novaDescricao = prompt('Nova descrição:', produto.descricao);
    const novoPreco = prompt('Novo preço:', produto.preco.toString());
    const novaQuantidade = prompt('Nova quantidade:', produto.quantidade.toString());

    if (!novoNome || !novaDescricao || !novoPreco || !novaQuantidade) return;

    try {
      const resposta = await fetch(`http://54.146.151.102:8000/produtos/${produto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: novoNome,
          descricao: novaDescricao,
          preco: parseFloat(novoPreco),
          quantidade: parseInt(novaQuantidade)
        })
      });

      if (!resposta.ok) throw new Error('Erro ao atualizar');
      
      await buscarProdutos();
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  return (
    <div className="container">
      <h1>Gerenciador de Produtos</h1>
      
      <AddProductForm onSuccess={buscarProdutos} />

      {carregando && <div className="status">Carregando produtos...</div>}
      
      {erro && <div className="erro">{erro}</div>}

      {!carregando && !erro && (
        <div className="lista-produtos">
          {produtos.length === 0 ? (
            <div className="sem-produtos">Nenhum produto cadastrado</div>
          ) : (
            produtos.map((produto) => (
              <div key={produto.id} className="produto">
                <h2>{produto.nome}</h2>
                <p>{produto.descricao}</p>
                <div className="detalhes">
                  <span>Quantidade: {produto.quantidade}</span>
                  <span>Preço: R$ {produto.preco.toFixed(2)}</span>
                </div>
                <div className="acoes">
                  <button 
                    onClick={() => handleEditar(produto)}
                    className="editar"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeletar(produto.id)}
                    className="excluir"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
