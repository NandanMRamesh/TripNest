import { Edit, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { expenseApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { currency, dateLabel } from '../utils';

export default function Expenses() {
  const { id } = useParams();
  const [expenses, setExpenses] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => expenseApi.list(id).then(setExpenses).catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, [id]);

  const save = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      category: form.get('category'),
      amount: Number(form.get('amount')),
      description: form.get('description'),
      expenseDate: form.get('expenseDate')
    };
    if (editing?.id) await expenseApi.update(id, editing.id, payload);
    else await expenseApi.create(id, payload);
    setEditing(null);
    setModalOpen(false);
    load();
  };

  const remove = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    await expenseApi.remove(id, expenseId);
    load();
  };

  const getCategoryBadge = (category) => {
    const s = String(category || '').toLowerCase();
    let cls = 'bg-slate-50 text-slate-655 border-slate-200';
    if (s.includes('food') || s.includes('dining') || s.includes('restaurant')) {
      cls = 'bg-amber-50 text-amber-700 border-amber-100';
    } else if (s.includes('flight') || s.includes('travel') || s.includes('transport') || s.includes('cab')) {
      cls = 'bg-blue-50 text-blue-700 border-blue-100';
    } else if (s.includes('hotel') || s.includes('stay') || s.includes('hotel') || s.includes('hostel')) {
      cls = 'bg-purple-50 text-purple-700 border-purple-100';
    } else if (s.includes('activity') || s.includes('sight') || s.includes('museum') || s.includes('fun')) {
      cls = 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${cls}`}>
        {category}
      </span>
    );
  };

  const columns = [
    { key: 'category', header: 'Category', render: (expense) => getCategoryBadge(expense.category) },
    { key: 'description', header: 'Description' },
    { key: 'expenseDate', header: 'Date', render: (expense) => dateLabel(expense.expenseDate) },
    { key: 'amount', header: 'Amount', render: (expense) => <span className="font-semibold text-slate-900">{currency(expense.amount)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (expense) => (
        <div className="flex gap-1.5">
          <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-650 hover:bg-slate-50 transition" onClick={() => { setEditing(expense); setModalOpen(true); }}><Edit className="h-4 w-4" /></button>
          <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-655 hover:bg-red-50 transition" onClick={() => remove(expense.id)}><Trash2 className="h-4 w-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
        <Link to={`/trips/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-950 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Trip Details
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Expenses</h1>
            <p className="mt-2 text-sm text-slate-500 font-light">Track trip spending by category and date logs.</p>
          </div>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4.5 py-2.5 text-sm shadow-lg shadow-indigo-650/15">
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-150 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-655">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {!expenses ? (
          <LoadingSpinner label="Loading expenses" />
        ) : (
          <Table columns={columns} rows={expenses} emptyMessage="No expenses tracked yet" />
        )}
        <div className="flex items-center justify-between pt-2">
          <Link to={`/trips/${id}/budget`} className="text-xs font-semibold text-indigo-650 hover:text-indigo-500 transition">
            View Budget Summary →
          </Link>
        </div>
      </div>

      <Modal open={modalOpen} title={editing ? 'Edit Expense' : 'Add Expense'} onClose={() => setModalOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <FormInput label="Category" name="category" placeholder="e.g. Flight, Restaurant, Hotel..." defaultValue={editing?.category || ''} required />
          <FormInput label="Amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" defaultValue={editing?.amount || ''} required />
          <FormInput label="Date" name="expenseDate" type="date" defaultValue={editing?.expenseDate || new Date().toISOString().slice(0, 10)} required />
          <FormInput label="Description" name="description" as="textarea" rows="3" placeholder="Notes (optional)..." defaultValue={editing?.description || ''} />
          
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 mt-6">
            <Button variant="secondary" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-2 font-medium">Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-505 text-white font-semibold rounded-xl px-4 py-2">Save Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
