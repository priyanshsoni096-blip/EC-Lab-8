from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import solver
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ACO Lab 8 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default data from Lab manual
DEFAULT_MATRIX = [
    [0, 10, 12, 11, 14],
    [10, 0, 13, 15, 8],
    [12, 13, 0, 9, 14],
    [11, 15, 9, 0, 16],
    [14, 8, 14, 16, 0]
]

class SolveRequest(BaseModel):
    matrix: Optional[List[List[float]]] = None
    algorithm: str # "elitist" or "rank"
    n_ants: int = 10
    n_iterations: int = 50
    alpha: float = 1.0
    beta: float = 2.0
    rho: float = 0.5
    Q: float = 1.0
    initial_pheromone: float = 1.0
    e: int = 5 # for elitist
    w: int = 6 # for rank-based

@app.get("/")
def read_root():
    return {"message": "ACO Lab 8 API is running"}

@app.get("/matrix")
def get_matrix():
    return {"matrix": DEFAULT_MATRIX}

@app.post("/solve")
def solve_tsp(req: SolveRequest):
    matrix = req.matrix or DEFAULT_MATRIX
    
    if req.algorithm.lower() == "elitist":
        result = solver.elitist_ant_system(
            matrix, n_ants=req.n_ants, n_iterations=req.n_iterations,
            alpha=req.alpha, beta=req.beta, rho=req.rho, Q=req.Q,
            initial_pheromone=req.initial_pheromone, elitist_weight=req.e
        )
    elif req.algorithm.lower() == "rank":
        result = solver.rank_based_ant_system(
            matrix, n_ants=req.n_ants, n_iterations=req.n_iterations,
            alpha=req.alpha, beta=req.beta, rho=req.rho, Q=req.Q,
            initial_pheromone=req.initial_pheromone, w=req.w
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid algorithm. Choose 'elitist' or 'rank'.")
    
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
