import numpy as np
import time

def elitist_ant_system(distance_matrix, n_ants=10, n_iterations=100, alpha=1.0, beta=2.0,
                       rho=0.5, Q=1.0, initial_pheromone=1.0, elitist_weight=5):
    dist = np.array(distance_matrix, dtype=float)
    n_cities = len(dist)
    pheromone = np.full((n_cities, n_cities), initial_pheromone)
    
    with np.errstate(divide='ignore', invalid='ignore'):
        eta = np.where(dist > 0, 1.0 / dist, 0.0)

    best_tour = None
    best_length = float('inf')
    history = []
    start_time = time.time()

    for iter in range(n_iterations):
        tours = []
        lengths = []
        for _ in range(n_ants):
            tour = _build_tour(n_cities, pheromone, eta, alpha, beta)
            length = _tour_length(tour, dist)
            tours.append(tour)
            lengths.append(length)
            if length < best_length:
                best_length = length
                best_tour = tour[:]

        # Evaporation
        pheromone *= (1 - rho)

        # Normal Ant Update
        for i in range(n_ants):
            contribution = Q / lengths[i]
            for j in range(len(tours[i]) - 1):
                pheromone[tours[i][j]][tours[i][j+1]] += contribution
                pheromone[tours[i][j+1]][tours[i][j]] += contribution

        # Elitist Update
        elitist_contribution = elitist_weight * (Q / best_length)
        for j in range(len(best_tour) - 1):
            pheromone[best_tour[j]][best_tour[j+1]] += elitist_contribution
            pheromone[best_tour[j+1]][best_tour[j]] += elitist_contribution

        history.append({
            "iteration": iter + 1,
            "best_length": float(best_length),
            "avg_length": float(np.mean(lengths))
        })

    return {
        "algorithm": "Elitist Ant System",
        "best_tour": best_tour,
        "best_length": float(best_length),
        "history": history,
        "time": time.time() - start_time
    }

def rank_based_ant_system(distance_matrix, n_ants=10, n_iterations=100, alpha=1.0, beta=2.0,
                           rho=0.5, Q=1.0, initial_pheromone=1.0, w=6):
    dist = np.array(distance_matrix, dtype=float)
    n_cities = len(dist)
    pheromone = np.full((n_cities, n_cities), initial_pheromone)
    
    with np.errstate(divide='ignore', invalid='ignore'):
        eta = np.where(dist > 0, 1.0 / dist, 0.0)

    best_tour = None
    best_length = float('inf')
    history = []
    start_time = time.time()

    for iter in range(n_iterations):
        tours_data = []
        for _ in range(n_ants):
            tour = _build_tour(n_cities, pheromone, eta, alpha, beta)
            length = _tour_length(tour, dist)
            tours_data.append((tour, length))
            if length < best_length:
                best_length = length
                best_tour = tour[:]

        # Sort tours by length
        tours_data.sort(key=lambda x: x[1])
        
        # Evaporation
        pheromone *= (1 - rho)

        # Rank-based Update: top w-1 ants
        for r in range(1, min(w, len(tours_data) + 1)):
            weight = w - r
            tour, length = tours_data[r-1]
            contribution = weight * (Q / length)
            for j in range(len(tour) - 1):
                pheromone[tour[j]][tour[j+1]] += contribution
                pheromone[tour[j+1]][tour[j]] += contribution

        # Global Best Update (weight w)
        gb_contribution = w * (Q / best_length)
        for j in range(len(best_tour) - 1):
            pheromone[best_tour[j]][best_tour[j+1]] += gb_contribution
            pheromone[best_tour[j+1]][best_tour[j]] += gb_contribution

        history.append({
            "iteration": iter + 1,
            "best_length": float(best_length),
            "avg_length": float(np.mean([x[1] for x in tours_data]))
        })

    return {
        "algorithm": "Rank-Based Ant System",
        "best_tour": best_tour,
        "best_length": float(best_length),
        "history": history,
        "time": time.time() - start_time
    }

def _build_tour(n_cities, pheromone, eta, alpha, beta):
    visited = [False] * n_cities
    current = np.random.randint(n_cities)
    tour = [current]
    visited[current] = True
    for _ in range(n_cities - 1):
        probs = []
        for j in range(n_cities):
            if not visited[j]:
                p = (pheromone[current][j] ** alpha) * (eta[current][j] ** beta)
                probs.append(p)
            else:
                probs.append(0.0)
        
        total = sum(probs)
        if total == 0:
            unvisited = [i for i, v in enumerate(visited) if not v]
            next_city = np.random.choice(unvisited)
        else:
            probs = [p / total for p in probs]
            next_city = np.random.choice(n_cities, p=probs)
        
        tour.append(int(next_city))
        visited[next_city] = True
        current = next_city
    tour.append(tour[0])
    return tour

def _tour_length(tour, dist):
    return sum(dist[tour[i]][tour[i+1]] for i in range(len(tour)-1))
