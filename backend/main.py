from db import supabase
from model import Produto
from fastapi import FastAPI, HTTPException  
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em desenvolvimento pode ser "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return {"API funcionando, use /docs para ver as rotas."}

@app.get('/produtos')
def list_all_products():
    try:
        response = supabase.table("produtos").select("*").execute()
        return response.data
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar produtos: {str(error)}")

@app.get('/produtos/{id}')
def get_product_by_id(id: str):
    try:
        response = supabase.table("produtos").select("*").eq("id", id).execute()
        if not response.data:
            raise HTTPException(status_d=404, detail="Produto não encontrado")
        return response.data[0]
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar produto: {str(error)}")

@app.post('/produtos/cadastrar')
def add_new_product(produto: Produto):
    try:
        data = produto.dict(exclude_unset=True)
        response = supabase.table("produtos").insert(data).execute()
        return {"mensagem": "Produto cadastrado com sucesso!", "dados": response.data[0]}
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Erro ao cadastrar: {str(error)}")

@app.put('/produtos/{id}')
def update_product(id: str, produto: Produto):
    try:
        data = produto.dict(exclude_unset=True)
        response = supabase.table("produtos").update(data).eq("id", id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        return {"mensagem": "Produto atualizado com sucesso!", "dados": response.data[0]}
    except Exception as erro:
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar: {str(erro)}")

@app.delete('/produtos/{id}')
def delete_product(id: str):
    try:
        response = supabase.table("produtos").delete().eq("id", id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        return {"mensagem": "Produto deletado com sucesso!"}
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Erro ao deletar: {str(error)}")
