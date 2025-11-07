import { useEffect, useState } from "react";
import Button from "../component/ui/Button";
import type { MealType } from "../types/type";
import SectionHeader from "../component/ui/SectionHeader";
import AddMealForm, {type MealFormData } from "../forms/AddMealForm";

function Meals() {
  const [meals, setMeals] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [showForm, setShowForm] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`${baseUrl}/meals`);
        if (!response.ok) throw new Error("Failed to fetch meals");

        const data = await response.json();
        setMeals(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [baseUrl]);

  const handleAddMeal = async (mealData: MealFormData) => {
    try {
      const response = await fetch(`${baseUrl}/meals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mealData),
      });

      if (!response.ok) throw new Error("Failed to add meal");

      const newMeal = await response.json();
      setMeals((prev) => [...prev, newMeal]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error adding meal");
    }
  };

  return (
    <div>
      <SectionHeader
        title="Meals"
        subtitle="Track nutritional intake and meal logs"
      >
        <Button onClick={() => setShowForm(true)}>Add Meal</Button>
      </SectionHeader>

      {loading && <p className="mt-4 text-gray-500">Loading Meals...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error}</p>}

      <table className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-50">
          <tr>
            {[
              "User",
              "Meal Type",
              "Food",
              "Calories",
              "Protein(g)",
              "Carbs(g)",
              "Fat(g)",
              "Date",
            ].map((head) => (
              <th
                key={head}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {meals.map((meal) => (
            <tr key={meal._id}>
              <td className="text-sm px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-medium mr-2">
                  {meal.user.name[0]}
                </span>
                {meal.user.name}
              </td>
              <td className="text-sm px-6 py-4 whitespace-nowrap">
                {meal.type}
              </td>
              <td className="text-sm px-6 py-4 whitespace-nowrap">
                {meal.name}
              </td>
              <td className="text-sm px-6 py-4 whitespace-nowrap">
                {meal.calories}
              </td>
              <td className="text-sm px-6 py-4 whitespace-nowrap">
                {meal.protein}
              </td>
              <td className="text-sm px-6 py-4 whitespace-nowrap">
                {meal.carbs}
              </td>
              <td className="text-sm px-6 py-4 whitespace-nowrap">
                {meal.fat}
              </td>
              <td className="text-sm px-6 py-4 whitespace-nowrap">
                {meal.date?.split("T")[0]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <AddMealForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddMeal}
        />
      )}
    </div>
  );
}

export default Meals;
