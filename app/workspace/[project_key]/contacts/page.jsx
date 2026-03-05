"use client"

import { useEffect, useMemo, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import Select from "react-select"

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [search, setSearch] = useState("")
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")

  const [formOpen, setFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      const [contactsRes, groupsRes] = await Promise.all([
        api.get("/api/contacts"),
        api.get("/api/contact-groups"),
      ])

      setContacts(contactsRes.data.data || [])
      setGroups(groupsRes.data.data || [])
    } catch (err) {
      toast.error("Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  /* ---------------- FILTER ---------------- */

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch =
        contact.name?.toLowerCase().includes(search.toLowerCase()) ||
        contact.phone?.includes(search)

      const matchesGroup =
        !selectedGroup ||
        contact.groups?.some(g => g.id === selectedGroup.value)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "blocked" && contact.is_blocked === 1) ||
        (statusFilter === "active" && contact.is_blocked === 0)

      return matchesSearch && matchesGroup && matchesStatus
    })
  }, [contacts, search, selectedGroup, statusFilter])

  /* ---------------- CRUD ---------------- */

  const handleDelete = async (id) => {
    if (!confirm("Delete contact?")) return

    setProcessing(true)
    try {
      await api.delete(`/api/contacts/${id}`)
      toast.success("Deleted")
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed")
    } finally {
      setProcessing(false)
    }
  }

  const handleSubmit = async (data) => {
    try {
      if (editingContact) {
        await api.put(`/api/contacts/${editingContact.id}`, data)
        toast.success("Contact updated")
      } else {
        await api.post("/api/contacts", data)
        toast.success("Contact created")
      }

      setFormOpen(false)
      setEditingContact(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button
          onClick={() => {
            setEditingContact(null)
            setFormOpen(true)
          }}
        >
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 grid md:grid-cols-3 gap-4">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            options={groups.map(g => ({
              value: g.id,
              label: g.name,
            }))}
            value={selectedGroup}
            onChange={setSelectedGroup}
            placeholder="Filter by group"
            isClearable
          />

          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Groups</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredContacts.map(contact => (
                <tr key={contact.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{contact.name}</td>
                  <td className="px-4 py-3">{contact.phone}</td>
                  <td className="px-4 py-3">{contact.email || "—"}</td>
                  <td className="px-4 py-3">
                    {contact.groups?.map(g => g.name).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {contact.is_blocked === 1 ? (
                      <span className="text-red-500 text-xs">Blocked</span>
                    ) : (
                      <span className="text-green-600 text-xs">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Pencil
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => {
                          setEditingContact(contact)
                          setFormOpen(true)
                        }}
                      />
                      <Trash2
                        className="h-4 w-4 cursor-pointer text-red-500"
                        onClick={() => handleDelete(contact.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </CardContent>
      </Card>

      {/* Modal */}
      {formOpen && (
        <ContactFormModal
          groups={groups}
          initialData={editingContact}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

    </div>
  )
}

/* ---------------- MODAL COMPONENT ---------------- */

function ContactFormModal({ groups, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    group_ids: initialData?.groups?.map(g => g.id) || [],
    is_blocked: initialData?.is_blocked || 0,
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">

        <h2 className="text-lg font-semibold">
          {initialData ? "Edit Contact" : "Create Contact"}
        </h2>

        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Select
          isMulti
          options={groups.map(g => ({
            value: g.id,
            label: g.name,
          }))}
          value={groups
            .filter(g => form.group_ids.includes(g.id))
            .map(g => ({
              value: g.id,
              label: g.name,
            }))}
          onChange={(selected) =>
            setForm({
              ...form,
              group_ids: selected
                ? selected.map(item => item.value)
                : [],
            })
          }
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={() => onSubmit(form)}>
            Save
          </Button>
        </div>

      </div>
    </div>
  )
}