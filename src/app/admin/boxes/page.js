"use client";

import { useEffect, useMemo, useState } from "react";

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mb-4">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      if (raw != null) {
        setState(JSON.parse(raw));
      }
    } catch {}
  }, [key]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {}
  }, [key, state]);

  return [state, setState];
}

function BoxForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialValue ?? { id: undefined, name: "", description: "", size: "Medium" }
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = { ...form, name: form.name.trim() };
    if (!trimmed.name) return;
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Spring Promo Box"
          className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
          className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950"
          rows={3}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Size</label>
        <select
          name="size"
          value={form.size}
          onChange={handleChange}
          className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950"
        >
          <option>Small</option>
          <option>Medium</option>
          <option>Large</option>
        </select>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default function BoxesPage() {
  const [boxes, setBoxes] = useLocalStorageState("admin_boxes", []);
  const [query, setQuery] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return boxes;
    const q = query.trim().toLowerCase();
    return boxes.filter((b) =>
      [b.name, b.description, b.size].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [boxes, query]);

  function handleAdd(newBox) {
    const boxWithId = { ...newBox, id: crypto.randomUUID(), createdAt: Date.now() };
    setBoxes((prev) => [boxWithId, ...prev]);
    setIsAddOpen(false);
    setSelectedBox(boxWithId);
    setIsViewOpen(true);
  }

  function handleEdit(updatedBox) {
    setBoxes((prev) => prev.map((b) => (b.id === updatedBox.id ? { ...b, ...updatedBox } : b)));
    setIsEditOpen(false);
    setSelectedBox(updatedBox);
    setIsViewOpen(true);
  }

  function handleDelete(id) {
    if (!confirm("Delete this box?")) return;
    setBoxes((prev) => prev.filter((b) => b.id !== id));
    if (selectedBox?.id === id) {
      setSelectedBox(null);
      setIsViewOpen(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold">Boxes</h1>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search boxes..."
            className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 sm:w-72"
          />
          <button
            onClick={() => setIsAddOpen(true)}
            className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Add New Box
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">Description</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-800 dark:bg-neutral-950">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-sm text-neutral-500">
                  No boxes found
                </td>
              </tr>
            ) : (
              filtered.map((box) => (
                <tr key={box.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                  <td className="px-4 py-3 text-sm font-medium">{box.name}</td>
                  <td className="px-4 py-3 text-sm">{box.size}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {box.description || <span className="italic text-neutral-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedBox(box);
                          setIsViewOpen(true);
                        }}
                        className="rounded border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBox(box);
                          setIsEditOpen(true);
                        }}
                        className="rounded border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(box.id)}
                        className="rounded border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal
        open={isAddOpen}
        title="Add New Box"
        onClose={() => setIsAddOpen(false)}
        footer={null}
      >
        <BoxForm
          initialValue={{ name: "", description: "", size: "Medium" }}
          onSubmit={handleAdd}
          onCancel={() => setIsAddOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditOpen}
        title="Edit Box"
        onClose={() => setIsEditOpen(false)}
        footer={null}
      >
        {selectedBox ? (
          <BoxForm
            initialValue={selectedBox}
            onSubmit={handleEdit}
            onCancel={() => setIsEditOpen(false)}
          />
        ) : null}
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewOpen}
        title="Box Details"
        onClose={() => setIsViewOpen(false)}
        footer={
          selectedBox && (
            <>
              <button
                onClick={() => {
                  setIsViewOpen(false);
                  setIsEditOpen(true);
                }}
                className="rounded border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (!selectedBox) return;
                  handleDelete(selectedBox.id);
                  setIsViewOpen(false);
                }}
                className="rounded border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/30"
              >
                Delete
              </button>
            </>
          )
        }
      >
        {selectedBox ? (
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-xs uppercase text-neutral-500">Name</div>
              <div className="font-medium">{selectedBox.name}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-neutral-500">Size</div>
              <div className="font-medium">{selectedBox.size}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-neutral-500">Description</div>
              <div className="text-neutral-700 dark:text-neutral-300">
                {selectedBox.description || <span className="italic text-neutral-400">—</span>}
              </div>
            </div>
            {selectedBox.createdAt ? (
              <div>
                <div className="text-xs uppercase text-neutral-500">Created</div>
                <div className="text-neutral-700 dark:text-neutral-300">
                  {new Date(selectedBox.createdAt).toLocaleString()}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}