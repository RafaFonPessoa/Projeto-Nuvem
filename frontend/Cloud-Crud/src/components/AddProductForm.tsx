// src/components/AddProductForm.tsx
import { useState } from 'react';

interface AddProductFormProps {
  onSuccess: () => void;
}

const AddProductForm = ({ onSuccess }: AddProductFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    quantidade: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const resposta = await fetch('http://127.0.0.1:8000/produtos/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!resposta.ok) throw new Error('Erro ao cadastrar');

      setFormData({
        nome: '',
        descricao: '',
        preco: 0,
        quantidade: 0
      });

      await onSuccess();
      alert('Produto cadastrado com sucesso!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao cadastrar');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' || name === 'quantidade' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="form-produto">
      <h2>Adicionar Novo Produto</h2>
      <div className="form-group">
        <label>Nome:</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Descrição:</label>
        <input
          type="text"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Preço (R$):</label>
        <input
          type="number"
          name="preco"
          value={formData.preco}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />
      </div>
      
      <div className="form-group">
        <label>Quantidade:</label>
        <input
          type="number"
          name="quantidade"
          value={formData.quantidade}
          onChange={handleChange}
          min="0"
          required
        />
      </div>
      
      <button type="submit" className="adicionar">
        Adicionar Produto
      </button>
    </form>
  );
};

export default AddProductForm;