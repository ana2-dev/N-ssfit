
import { useState, useEffect } from 'react';
import { Plus, Trash2, Utensils } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  price: number;
}

export function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('nessfit_recipes');

    if (stored) {
      setRecipes(JSON.parse(stored));
    }
  }, []);

  const addRecipe = () => {
    const newRecipe = {
      id: Date.now().toString(),
      name,
      price
    };

    const updated = [...recipes, newRecipe];

    setRecipes(updated);

    localStorage.setItem(
      'nessfit_recipes',
      JSON.stringify(updated)
    );

    setName('');
    setPrice(0);
  };

  const deleteRecipe = (id: string) => {
    const updated = recipes.filter(
      recipe => recipe.id !== id
    );

    setRecipes(updated);

    localStorage.setItem(
      'nessfit_recipes',
      JSON.stringify(updated)
    );
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Gerenciamento de Pratos
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">

        <input
          type="text"
          placeholder="Nome do prato"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={addRecipe}
          className="bg-[#4CAF50] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={18} />
          Adicionar Prato
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {recipes.map((recipe) => (

          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between">

              <div className="flex items-center gap-2">
                <Utensils size={20} />
                <h3 className="font-bold">
                  {recipe.name}
                </h3>
              </div>

              <button
                onClick={() => deleteRecipe(recipe.id)}
              >
                <Trash2
                  size={18}
                  className="text-red-500"
                />
              </button>

            </div>

            <p className="mt-3 font-semibold text-green-600">
              R$ {recipe.price.toFixed(2)}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}