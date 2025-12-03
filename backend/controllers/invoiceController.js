const supabase = require("../config/supabase");

//@desc Create new invoice
//@route POST /api/invoices
//@access Private

exports.createInvoice = async (req, res) => {

    try {
        const user = req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
        } = req.body;

        //subtotal calculation
        let subtotal = 0;
        let taxTotal = 0;
        items.forEach((item) => {
            subtotal += item.unitPrice * item.quantity;
            taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
        });
        const total = subtotal + taxTotal;

        const { data: invoice, error } = await supabase
            .from('invoices')
            .insert([
                {
                    user_id: user.id,
                    invoice_number: invoiceNumber,
                    invoice_date: invoiceDate,
                    due_date: dueDate,
                    bill_from: billFrom,
                    bill_to: billTo,
                    items: items,
                    notes: notes,
                    payment_terms: paymentTerms,
                    subtotal: subtotal,
                    tax_total: taxTotal,
                    total: total,
                    status: "Unpaid"
                }
            ])
            .select()
            .single();

        if (error) throw error;

        // Map back to frontend expected format (camelCase)
        const formattedInvoice = {
            ...invoice,
            _id: invoice.id,
            invoiceNumber: invoice.invoice_number,
            invoiceDate: invoice.invoice_date,
            dueDate: invoice.due_date,
            billFrom: invoice.bill_from,
            billTo: invoice.bill_to,
            paymentTerms: invoice.payment_terms,
            taxTotal: invoice.tax_total,
            user: user
        };

        res.status(201).json(formattedInvoice);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating invoice", error: error.message });
    }
}


//@desc Get all invoices of logged-in user
//@route GET /api/invoices
//@access Private

exports.getInvoices = async (req, res) => {
    try {
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select(`
                *,
                user:users (name, email)
            `)
            .eq('user_id', req.user.id);

        if (error) throw error;

        const formattedInvoices = invoices.map(inv => ({
            ...inv,
            _id: inv.id,
            invoiceNumber: inv.invoice_number,
            invoiceDate: inv.invoice_date,
            dueDate: inv.due_date,
            billFrom: inv.bill_from,
            billTo: inv.bill_to,
            paymentTerms: inv.payment_terms,
            taxTotal: inv.tax_total,
            user: inv.user // Supabase returns joined data in 'user' property
        }));

        res.json(formattedInvoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching invoice", error: error.message });
    }
}


//@desc Get single invoice by Id
//@route GET /api/invoices/:id
//@access Private
exports.getInvoiceById = async (req, res) => {
    try {
        const { data: invoice, error } = await supabase
            .from('invoices')
            .select(`
                *,
                user:users (name, email)
            `)
            .eq('id', req.params.id)
            .single();

        if (error || !invoice) return res.status(404).json({ message: "Invoice not found" });

        //check if the invoice belongs to the user
        if (invoice.user_id !== req.user.id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const formattedInvoice = {
            ...invoice,
            _id: invoice.id,
            invoiceNumber: invoice.invoice_number,
            invoiceDate: invoice.invoice_date,
            dueDate: invoice.due_date,
            billFrom: invoice.bill_from,
            billTo: invoice.bill_to,
            paymentTerms: invoice.payment_terms,
            taxTotal: invoice.tax_total,
            user: invoice.user
        };

        res.json(formattedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching invoice", error: error.message });
    }
}

//@desc Update Invoice
//@route PUT /api/invoices
//@access Private
exports.updateInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            status,
        } = req.body;

        //recalculate details if items changed
        let subtotal = 0;
        let taxTotal = 0;
        if (items && items.length > 0) {
            items.forEach((item) => {
                subtotal += item.unitPrice * item.quantity;
                taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
            });
        }
        const total = subtotal + taxTotal;

        const updates = {
            invoice_number: invoiceNumber,
            invoice_date: invoiceDate,
            due_date: dueDate,
            bill_from: billFrom,
            bill_to: billTo,
            items: items,
            notes: notes,
            payment_terms: paymentTerms,
            status: status,
            subtotal: subtotal,
            tax_total: taxTotal,
            total: total,
            updated_at: new Date()
        };

        const { data: updatedInvoice, error } = await supabase
            .from('invoices')
            .update(updates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });

        const formattedInvoice = {
            ...updatedInvoice,
            _id: updatedInvoice.id,
            invoiceNumber: updatedInvoice.invoice_number,
            invoiceDate: updatedInvoice.invoice_date,
            dueDate: updatedInvoice.due_date,
            billFrom: updatedInvoice.bill_from,
            billTo: updatedInvoice.bill_to,
            paymentTerms: updatedInvoice.payment_terms,
            taxTotal: updatedInvoice.tax_total,
        };

        res.json(formattedInvoice);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating invoice", error: error.message });
    }
}

//@desc Delete Invoice
//@route DELETE /api/invoices/:id
//@access Private
exports.deleteInvoice = async (req, res) => {
    try {
        const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;

        res.json({ message: "Invoice Deleted sucessfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting invoice", error: error.message });
    }
}