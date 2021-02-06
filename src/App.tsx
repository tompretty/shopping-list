import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Category } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import * as z from "zod";
import ItemsList from "./components/ItemsList";
import NewItemForm from "./components/NewItemForm";

const useStyles = makeStyles(({ spacing, palette }) => ({
  appBar: {
    padding: `${spacing(1)}px ${spacing(4)}px`,
  },

  container: {
    background: palette.grey[100],
    width: "100vw",
    height: "100vh",
    overflow: "auto",
  },

  bodyContainer: {
    paddingTop: spacing(12),
    paddingBottom: spacing(12),
  },

  listContainer: {
    marginTop: spacing(4),
    "& > * + *": {
      marginTop: spacing(3),
    },
  },
}));

export interface Item {
  id: string;
  name: string;
  quantity: number;
}

export interface Items {
  [itemId: string]: Item;
}

export interface Category {
  id: string;
  name: string;
  itemIds: string[];
}

export interface Categories {
  [categoryId: string]: Category;
}

export interface ShoppingList {
  items: Items;
  categories: Categories;
  categoryIds: string[];
  nextItemId: number;
  nextCategoryId: number;
}

const ItemsSchema = z.record(
  z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
  })
);

const CategorySchema = z.record(
  z.object({
    id: z.string(),
    name: z.string(),
    itemIds: z.array(z.string()),
  })
);

const ShoppingListSchema = z.object({
  items: ItemsSchema,
  categories: CategorySchema,
  categoryIds: z.array(z.string()),
  nextItemId: z.number(),
  nextCategoryId: z.number(),
});

const App: React.FC = () => {
  let initialShoppingList: ShoppingList = {
    items: {},
    categories: {},
    categoryIds: [],
    nextItemId: 0,
    nextCategoryId: 0,
  };

  try {
    initialShoppingList = ShoppingListSchema.parse(
      JSON.parse(localStorage.getItem("shopping-list") || "")
    );
  } catch {}

  const [shoppingList, setShoppingList] = useState<ShoppingList>(
    initialShoppingList
  );

  useEffect(() => {
    localStorage.setItem("shopping-list", JSON.stringify(shoppingList));
  }, [shoppingList]);

  const onDragEnd = ({
    destination,
    source,
    draggableId,
    type,
  }: DropResult) => {
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "category") {
      const newCategoryIds = [...shoppingList.categoryIds];
      newCategoryIds.splice(source.index, 1);
      newCategoryIds.splice(destination.index, 0, draggableId);

      setShoppingList({
        ...shoppingList,
        categoryIds: newCategoryIds,
      });
    } else {
      if (destination.droppableId === source.droppableId) {
        const category = shoppingList.categories[destination.droppableId];
        const newItemIds = [...category.itemIds];
        newItemIds.splice(source.index, 1);
        newItemIds.splice(destination.index, 0, draggableId);

        setShoppingList({
          ...shoppingList,
          categories: {
            ...shoppingList.categories,
            [category.id]: {
              ...category,
              itemIds: newItemIds,
            },
          },
        });
      } else {
        const sourceCategory = shoppingList.categories[source.droppableId];
        const sourceNewItemIds = [...sourceCategory.itemIds];
        sourceNewItemIds.splice(source.index, 1);

        const destinationCategory =
          shoppingList.categories[destination.droppableId];
        const destinationNewItemIds = [...destinationCategory.itemIds];
        destinationNewItemIds.splice(destination.index, 0, draggableId);

        setShoppingList({
          ...shoppingList,
          categories: {
            ...shoppingList.categories,
            [sourceCategory.id]: {
              ...sourceCategory,
              itemIds: sourceNewItemIds,
            },
            [destinationCategory.id]: {
              ...destinationCategory,
              itemIds: destinationNewItemIds,
            },
          },
        });
      }
    }
  };

  const onCategorySave = (categoryId: string) => (name: string) => {
    setShoppingList({
      ...shoppingList,
      categories: {
        ...shoppingList.categories,
        [categoryId]: {
          ...shoppingList.categories[categoryId],
          name,
        },
      },
    });
  };

  const onCategoryDelete = (categoryId: string) => () => {
    const newCategoryIds = shoppingList.categoryIds.filter(
      (id) => id !== categoryId
    );

    const newCategories = { ...shoppingList.categories };
    delete newCategories[categoryId];

    const newItems = { ...shoppingList.items };
    shoppingList.categories[categoryId].itemIds.forEach((itemId) => {
      delete newItems[itemId];
    });

    setShoppingList({
      ...shoppingList,
      items: newItems,
      categories: newCategories,
      categoryIds: newCategoryIds,
    });
  };

  const onSaveItem = (itemId: string) => (name: string, quantity: number) => {
    setShoppingList({
      ...shoppingList,
      items: {
        ...shoppingList.items,
        [itemId]: {
          ...shoppingList.items[itemId],
          name,
          quantity,
        },
      },
    });
  };

  const onDeleteItem = (categoryId: string) => (itemId: string) => () => {
    const newItems = { ...shoppingList.items };
    delete newItems[itemId];

    const newCategory = { ...shoppingList.categories[categoryId] };
    newCategory.itemIds = newCategory.itemIds.filter((i) => i !== itemId);

    let newCategoryIds = [...shoppingList.categoryIds];
    const newCategories = {
      ...shoppingList.categories,
      [categoryId]: newCategory,
    };

    if (newCategory.itemIds.length === 0) {
      delete newCategories[categoryId];
      newCategoryIds = newCategoryIds.filter((c) => c !== categoryId);
    }

    setShoppingList({
      ...shoppingList,
      items: newItems,
      categories: newCategories,
      categoryIds: newCategoryIds,
    });
  };

  const nextItemId = (): string => `item-${shoppingList.nextItemId}`;
  const nextCategoryId = (): string =>
    `category-${shoppingList.nextCategoryId}`;

  const onCreateItem = (
    name: string,
    quantity: number,
    categoryName: string
  ) => {
    const itemIds = Object.keys(shoppingList.items);
    const itemId = itemIds.find((iId) => shoppingList.items[iId].name === name);

    // item already exists, so just increment
    if (itemId) {
      const newItem = { ...shoppingList.items[itemId] };
      newItem.quantity += quantity;

      const newItems = { ...shoppingList.items, [itemId]: newItem };

      setShoppingList({ ...shoppingList, items: newItems });

      return;
    }

    const categoryId = shoppingList.categoryIds.find(
      (cId) => shoppingList.categories[cId].name === categoryName
    );

    // item doesn't exist, but category does
    if (categoryId) {
      const newItem: Item = {
        id: nextItemId(),
        name,
        quantity,
      };

      const newItems = { ...shoppingList.items, [newItem.id]: newItem };

      const newCategory = { ...shoppingList.categories[categoryId] };
      newCategory.itemIds = [...newCategory.itemIds, newItem.id];

      const newCategories = {
        ...shoppingList.categories,
        [categoryId]: newCategory,
      };

      setShoppingList({
        ...shoppingList,
        items: newItems,
        categories: newCategories,
        nextItemId: shoppingList.nextItemId + 1,
      });

      return;
    }

    // neither item nor category exist
    const newItem: Item = {
      id: nextItemId(),
      name: name,
      quantity: quantity,
    };

    const newItems = { ...shoppingList.items, [newItem.id]: newItem };

    const newCategory: Category = {
      id: nextCategoryId(),
      name: categoryName,
      itemIds: [newItem.id],
    };

    const newCategories = {
      ...shoppingList.categories,
      [newCategory.id]: newCategory,
    };
    const newCategoryIds = [...shoppingList.categoryIds, newCategory.id];

    setShoppingList({
      ...shoppingList,
      items: newItems,
      categories: newCategories,
      categoryIds: newCategoryIds,
      nextItemId: shoppingList.nextItemId + 1,
      nextCategoryId: shoppingList.nextCategoryId + 1,
    });
  };

  const existingItemNames = Object.keys(shoppingList.items).map(
    (iId) => shoppingList.items[iId].name
  );

  const existingCategoryNames = Object.keys(shoppingList.categories).map(
    (cId) => shoppingList.categories[cId].name
  );

  const itemsToString = () =>
    shoppingList.categoryIds
      .map((cId) => shoppingList.categories[cId].itemIds)
      .flat()
      .map((iId) => shoppingList.items[iId])
      .map((i) => `${i.quantity} ${i.name}`)
      .reverse()
      .join("\n");

  const onCopyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = itemsToString();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  const onStartNewList = () => {
    setShoppingList({
      items: {},
      categories: {},
      categoryIds: [],
      nextItemId: 0,
      nextCategoryId: 0,
    });
  };

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <AppBar className={classes.appBar}>
        <Typography variant="h6">Build my shopping list</Typography>
      </AppBar>

      <div className={classes.bodyContainer}>
        <Container maxWidth="md">
          <div>
            <NewItemForm
              existingNames={existingItemNames}
              existingCategoryNames={existingCategoryNames}
              onCreateItem={onCreateItem}
              onCopyToClipboard={onCopyToClipboard}
              onStartNewList={onStartNewList}
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="all-categories" type="category">
              {(provided) => (
                <div
                  className={classes.listContainer}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {shoppingList.categoryIds.map((categoryId, index) => {
                    const category = shoppingList.categories[categoryId];
                    const items = category.itemIds.map(
                      (itemId) => shoppingList.items[itemId]
                    );

                    return (
                      <ItemsList
                        key={categoryId}
                        onSave={onCategorySave(categoryId)}
                        onDelete={onCategoryDelete(categoryId)}
                        onSaveItem={onSaveItem}
                        onDeleteItem={onDeleteItem(categoryId)}
                        index={index}
                        category={category}
                        items={items}
                      />
                    );
                  })}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Container>
      </div>
    </div>
  );
};

export default App;
