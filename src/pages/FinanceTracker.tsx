import { useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { FinanceEntry, saveFinanceEntries, loadFinanceEntries } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

const categories = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other Income"],
  expense: ["Food", "Transport", "Shopping", "Bills", "Healthcare", "Entertainment", "Other Expense"]
};

export default function FinanceTracker() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entryType, setEntryType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    setEntries(loadFinanceEntries());
  }, []);

  useEffect(() => {
    saveFinanceEntries(entries);
  }, [entries]);

  const addEntry = () => {
    if (!amount || !description || !category) {
      toast({ title: "Please fill all fields" });
      return;
    }

    const newEntry: FinanceEntry = {
      id: Date.now().toString(),
      type: entryType,
      amount: parseFloat(amount),
      description: description.trim(),
      category,
      date: new Date(),
      createdAt: new Date(),
    };

    setEntries(prev => [newEntry, ...prev]);
    setIsDialogOpen(false);
    setAmount("");
    setDescription("");
    setCategory("");
    toast({ title: `${entryType === 'income' ? 'Income' : 'Expense'} added!` });
  };

  const openDialog = (type: 'income' | 'expense') => {
    setEntryType(type);
    setCategory("");
    setIsDialogOpen(true);
  };

  const calculateTotals = () => {
    const income = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const expenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const balance = income - expenses;
    
    return { income, expenses, balance };
  };

  const { income, expenses, balance } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const incomeEntries = entries.filter(e => e.type === 'income');
  const expenseEntries = entries.filter(e => e.type === 'expense');

  return (
    <MobileLayout title="Finance Tracker">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className={`border-l-4 ${balance >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </div>
              <div className="text-sm text-muted-foreground">Current Balance</div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(income)}
                </div>
                <div className="text-xs text-muted-foreground">Total Income</div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4 text-center">
                <div className="text-xl font-bold text-red-600">
                  {formatCurrency(expenses)}
                </div>
                <div className="text-xs text-muted-foreground">Total Expenses</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Entry Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={() => openDialog('income')} 
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Add Income
          </Button>
          <Button 
            onClick={() => openDialog('expense')} 
            variant="destructive" 
            className="flex-1"
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Entries List */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({entries.length})</TabsTrigger>
            <TabsTrigger value="income">Income ({incomeEntries.length})</TabsTrigger>
            <TabsTrigger value="expense">Expense ({expenseEntries.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-3">
              {entries.slice(0, 20).map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          entry.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {entry.type === 'income' ? 
                            <TrendingUp className="h-4 w-4" /> : 
                            <TrendingDown className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <div className="font-medium">{entry.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {entry.category} • {formatDate(entry.date)}
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="income" className="mt-6">
            <div className="space-y-3">
              {incomeEntries.slice(0, 20).map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{entry.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.category} • {formatDate(entry.date)}
                        </div>
                      </div>
                      <div className="font-bold text-green-600">
                        +{formatCurrency(entry.amount)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="expense" className="mt-6">
            <div className="space-y-3">
              {expenseEntries.slice(0, 20).map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{entry.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.category} • {formatDate(entry.date)}
                        </div>
                      </div>
                      <div className="font-bold text-red-600">
                        -{formatCurrency(entry.amount)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Entry Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add {entryType === 'income' ? 'Income' : 'Expense'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[entryType].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={addEntry} className="w-full">
                Add {entryType === 'income' ? 'Income' : 'Expense'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
}