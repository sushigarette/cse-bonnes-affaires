import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, FileText, Gift, Calendar, User } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("articles");

  // État pour les formulaires
  const [articleForm, setArticleForm] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    image: ""
  });

  const [promoForm, setPromoForm] = useState({
    title: "",
    description: "",
    code: "",
    discount: "",
    validUntil: "",
    partner: "",
    category: "",
    image: ""
  });

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, on ajouterait la logique pour sauvegarder l'article
    toast({
      title: "Article créé !",
      description: "L'article a été publié avec succès.",
    });
    setArticleForm({ title: "", content: "", category: "", author: "", image: "" });
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, on ajouterait la logique pour sauvegarder le code promo
    toast({
      title: "Code promo créé !",
      description: "Le code promo a été ajouté avec succès.",
    });
    setPromoForm({ title: "", description: "", code: "", discount: "", validUntil: "", partner: "", category: "", image: "" });
  };

  const articleCategories = ["Social", "Événement", "Pratique", "Formation"];
  const promoCategories = ["Loisirs", "Vacances", "Restauration", "Sport", "Transport", "Culture", "Alimentation"];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mr-3">
              <Plus className="w-6 h-6 text-white" />
            </div>
            Administration CSE
          </h1>
          <p className="text-lg text-muted-foreground">
            Gérez les articles et codes promo du portail
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="gradient-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Articles</p>
                  <p className="text-2xl font-bold text-primary">24</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardHeader>
          </Card>

          <Card className="gradient-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Codes Promo</p>
                  <p className="text-2xl font-bold text-success">15</p>
                </div>
                <Gift className="w-8 h-8 text-success" />
              </div>
            </CardHeader>
          </Card>

          <Card className="gradient-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                  <p className="text-2xl font-bold text-warning">6</p>
                </div>
                <Calendar className="w-8 h-8 text-warning" />
              </div>
            </CardHeader>
          </Card>

          <Card className="gradient-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vues totales</p>
                  <p className="text-2xl font-bold text-destructive">2.4k</p>
                </div>
                <User className="w-8 h-8 text-destructive" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Forms */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Nouvel Article
            </TabsTrigger>
            <TabsTrigger value="promos" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Nouveau Code Promo
            </TabsTrigger>
          </TabsList>

          {/* Article Form */}
          <TabsContent value="articles">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Créer un nouvel article
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleArticleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="article-title">Titre de l'article *</Label>
                      <Input
                        id="article-title"
                        placeholder="Entrez le titre de l'article"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="article-category">Catégorie *</Label>
                      <Select 
                        value={articleForm.category} 
                        onValueChange={(value) => setArticleForm({ ...articleForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {articleCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="article-author">Auteur *</Label>
                      <Input
                        id="article-author"
                        placeholder="Nom de l'auteur"
                        value={articleForm.author}
                        onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="article-image">URL de l'image</Label>
                      <Input
                        id="article-image"
                        placeholder="https://exemple.com/image.jpg"
                        value={articleForm.image}
                        onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="article-content">Contenu de l'article *</Label>
                    <Textarea
                      id="article-content"
                      placeholder="Rédigez le contenu de votre article..."
                      className="min-h-[120px]"
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Publier l'article
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promo Form */}
          <TabsContent value="promos">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Créer un nouveau code promo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePromoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-title">Titre de l'offre *</Label>
                      <Input
                        id="promo-title"
                        placeholder="Ex: Réduction cinéma UGC"
                        value={promoForm.title}
                        onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo-partner">Partenaire *</Label>
                      <Input
                        id="promo-partner"
                        placeholder="Ex: UGC Cinémas"
                        value={promoForm.partner}
                        onChange={(e) => setPromoForm({ ...promoForm, partner: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-code">Code promo *</Label>
                      <Input
                        id="promo-code"
                        placeholder="Ex: CSE2024UGC"
                        value={promoForm.code}
                        onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo-discount">Réduction *</Label>
                      <Input
                        id="promo-discount"
                        placeholder="Ex: -30%"
                        value={promoForm.discount}
                        onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo-valid">Valide jusqu'au *</Label>
                      <Input
                        id="promo-valid"
                        type="date"
                        value={promoForm.validUntil}
                        onChange={(e) => setPromoForm({ ...promoForm, validUntil: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-category">Catégorie *</Label>
                      <Select 
                        value={promoForm.category} 
                        onValueChange={(value) => setPromoForm({ ...promoForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {promoCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo-image">URL de l'image</Label>
                      <Input
                        id="promo-image"
                        placeholder="https://exemple.com/image.jpg"
                        value={promoForm.image}
                        onChange={(e) => setPromoForm({ ...promoForm, image: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promo-description">Description de l'offre *</Label>
                    <Textarea
                      id="promo-description"
                      placeholder="Décrivez les détails de l'offre..."
                      className="min-h-[100px]"
                      value={promoForm.description}
                      onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    Créer le code promo
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;