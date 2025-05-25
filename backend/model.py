from pydantic import BaseModel
from typing import Optional

class Produto(BaseModel):
    nome:str
    descricao:Optional[str] = None
    quantidade:Optional[int] = None
    preco:Optional[int] = None

