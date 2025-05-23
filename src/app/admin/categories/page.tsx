import { Badge } from "@/components/ui/badge";
import CategoryForm from "@/features/categories/components/category-form";
import CategoryList from "@/features/categories/components/category-list";
import { getCategories } from "@/features/categories/db/categories";

const CategoriesAdminPage = async () => {
  const categories = await getCategories();

  const activeCategoryCount = categories.filter(
    (c) => c.status === "Active"
  ).length;

  const inactiveCategoryCount = categories.filter(
    (c) => c.status === "Inactive"
  ).length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center items-start gap-4 border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Category Menagement
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize your product categories efficiently
          </p>
        </div>

        <div className="flex flxe-wrap gap-2 sm:gap-3">
          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
            <span className="font-semibold text-green-600">
              {activeCategoryCount}
            </span>
            Active
          </Badge>

          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
            <span className="font-semibold text-gray-500">
              {inactiveCategoryCount}
            </span>
            Inactive
          </Badge>

          <Badge
            variant="outline"
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm"
          >
            <span className="font-semibold text-blue-600">
              {categories.length}
            </span>
            Total
          </Badge>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <CategoryForm />
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default CategoriesAdminPage;
