import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, FileText, Gift, Calendar, User, Loader2, Trash2, Edit } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getArticles, getPromos, createArticle, createPromo, updateArticle, updatePromo, deleteArticle, deletePromo, Article, Promo } from "@/lib/database";
import { formatDiscount } from "@/lib/formatDiscount";
import CategorySelect from "@/components/CategorySelect";
import RichTextEditor from "@/components/RichTextEditor";

const Admin = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("articles");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [articleCategories, setArticleCategories] = useState<string[]>(["Social", "Événement", "Pratique", "Formation"]);
  const [promoCategories, setPromoCategories] = useState<string[]>(["Loisirs", "Vacances", "Restauration", "Sport", "Transport", "Culture", "Alimentation"]);

  // État pour les formulaires
  const [articleForm, setArticleForm] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    image_url: "",
    article_url: ""
  });

  const [promoForm, setPromoForm] = useState({
    title: "",
    description: "",
    code: "",
    discount: "",
    valid_until: "",
    partner: "",
    category: "",
    image_url: "",
    website_url: ""
  });

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [articlesData, promosData] = await Promise.all([
        getArticles(),
        getPromos()
      ]);

      setArticles(articlesData);
      setPromos(promosData);

      // Extraire les catégories uniques des données existantes
      const existingArticleCategories = [...new Set(articlesData.map(article => article.category))];
      const existingPromoCategories = [...new Set(promosData.map(promo => promo.category))];
      
      // Mettre à jour les listes de catégories avec les nouvelles
      setArticleCategories(prev => {
        const combined = [...new Set([...prev, ...existingArticleCategories])]
          .filter(category => category && category.trim() !== "");
        return combined.sort();
      });
      
      setPromoCategories(prev => {
        const combined = [...new Set([...prev, ...existingPromoCategories])]
          .filter(category => category && category.trim() !== "");
        return combined.sort();
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createArticle({
        title: articleForm.title,
        content: articleForm.content,
        category: articleForm.category,
        author: articleForm.author,
        image_url: articleForm.image_url || undefined,
        article_url: articleForm.article_url || undefined,
        published: true
      });

      toast({
        title: "Article créé !",
        description: "L'article a été publié avec succès.",
      });
      
      setArticleForm({ title: "", content: "", category: "", author: "", image_url: "", article_url: "" });
      loadData(); // Recharger les données
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'article",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPromo({
        title: promoForm.title,
        description: promoForm.description,
        code: promoForm.code,
        discount: promoForm.discount,
        valid_until: promoForm.valid_until,
        partner: promoForm.partner,
        category: promoForm.category,
        image_url: promoForm.image_url || undefined,
        website_url: promoForm.website_url || undefined,
        active: true
      });

      toast({
        title: "Code promo créé !",
        description: "Le code promo a été ajouté avec succès.",
      });
      
      setPromoForm({ title: "", description: "", code: "", discount: "", valid_until: "", partner: "", category: "", image_url: "" });
      loadData(); // Recharger les données
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le code promo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      await deleteArticle(id);
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès.",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article",
        variant: "destructive"
      });
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) return;

    try {
      await deletePromo(id);
      toast({
        title: "Code promo supprimé",
        description: "Le code promo a été supprimé avec succès.",
      });
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le code promo",
        variant: "destructive"
      });
    }
  };

  // Fonctions d'édition
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      content: article.content,
      category: article.category,
      author: article.author,
      image_url: article.image_url || "",
      article_url: article.article_url || ""
    });
    setActiveTab("articles");
  };

  const handleEditPromo = (promo: Promo) => {
    setEditingPromo(promo);
    setPromoForm({
      title: promo.title,
      description: promo.description,
      code: promo.code,
      discount: promo.discount,
      valid_until: promo.valid_until,
      partner: promo.partner,
      category: promo.category,
      image_url: promo.image_url || "",
      website_url: promo.website_url || ""
    });
    setActiveTab("promos");
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
    setEditingPromo(null);
    setArticleForm({ title: "", content: "", category: "", author: "", image_url: "", article_url: "" });
    setPromoForm({ title: "", description: "", code: "", discount: "", valid_until: "", partner: "", category: "", image_url: "", website_url: "" });
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    setLoading(true);

    try {
      await updateArticle(editingArticle.id, {
        title: articleForm.title,
        content: articleForm.content,
        category: articleForm.category,
        author: articleForm.author,
        image_url: articleForm.image_url || undefined,
        article_url: articleForm.article_url || undefined
      });

      toast({
        title: "Article modifié !",
        description: "L'article a été mis à jour avec succès.",
      });
      
      handleCancelEdit();
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'article",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo) return;

    setLoading(true);

    try {
      await updatePromo(editingPromo.id, {
        title: promoForm.title,
        description: promoForm.description,
        code: promoForm.code,
        discount: promoForm.discount,
        valid_until: promoForm.valid_until,
        partner: promoForm.partner,
        category: promoForm.category,
        image_url: promoForm.image_url || undefined,
        website_url: promoForm.website_url || undefined
      });

      toast({
        title: "Code promo modifié !",
        description: "Le code promo a été mis à jour avec succès.",
      });
      
      handleCancelEdit();
      loadData();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le code promo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour gérer les catégories
  const handleArticleCategoryChange = (category: string) => {
    setArticleForm({ ...articleForm, category });
    
    // Ajouter la catégorie à la liste si elle n'existe pas et n'est pas vide
    if (category && category.trim() !== "" && !articleCategories.includes(category)) {
      setArticleCategories(prev => [...prev, category].sort());
    }
  };

  const handlePromoCategoryChange = (category: string) => {
    setPromoForm({ ...promoForm, category });
    
    // Ajouter la catégorie à la liste si elle n'existe pas et n'est pas vide
    if (category && category.trim() !== "" && !promoCategories.includes(category)) {
      setPromoCategories(prev => [...prev, category].sort());
    }
  };


  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">


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
                  {editingArticle ? "Modifier l'article" : "Créer un nouvel article"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingArticle ? handleUpdateArticle : handleArticleSubmit} className="space-y-6">
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
                      <CategorySelect
                        value={articleForm.category}
                        onChange={handleArticleCategoryChange}
                        categories={articleCategories}
                        placeholder="Sélectionnez une catégorie"
                      />
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
                        value={articleForm.image_url}
                        onChange={(e) => setArticleForm({ ...articleForm, image_url: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="article-url">Lien de l'article</Label>
                      <Input
                        id="article-url"
                        placeholder="https://exemple.com/article ou exemple.com/article"
                        value={articleForm.article_url}
                        onChange={(e) => setArticleForm({ ...articleForm, article_url: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Le protocole https:// sera ajouté automatiquement si absent
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="article-content">Contenu de l'article *</Label>
                    <RichTextEditor
                      content={articleForm.content}
                      onChange={(content) => setArticleForm({ ...articleForm, content })}
                      placeholder="Rédigez le contenu de votre article..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg" className="flex-1 md:flex-none">
                      <Save className="w-4 h-4 mr-2" />
                      {editingArticle ? "Mettre à jour" : "Publier l'article"}
                    </Button>
                    {editingArticle && (
                      <Button type="button" variant="outline" size="lg" onClick={handleCancelEdit}>
                        Annuler
                      </Button>
                    )}
                  </div>
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
                  {editingPromo ? "Modifier le code promo" : "Créer un nouveau code promo"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingPromo ? handleUpdatePromo : handlePromoSubmit} className="space-y-6">
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
                        value={promoForm.valid_until}
                        onChange={(e) => setPromoForm({ ...promoForm, valid_until: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promo-category">Catégorie *</Label>
                      <CategorySelect
                        value={promoForm.category}
                        onChange={handlePromoCategoryChange}
                        categories={promoCategories}
                        placeholder="Sélectionnez une catégorie"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo-image">URL de l'image</Label>
                      <Input
                        id="promo-image"
                        placeholder="https://exemple.com/image.jpg"
                        value={promoForm.image_url}
                        onChange={(e) => setPromoForm({ ...promoForm, image_url: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="promo-website">Lien du site partenaire</Label>
                      <Input
                        id="promo-website"
                        placeholder="partenaire.com ou https://partenaire.com"
                        value={promoForm.website_url}
                        onChange={(e) => setPromoForm({ ...promoForm, website_url: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Le protocole https:// sera ajouté automatiquement si absent
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promo-description">Description de l'offre *</Label>
                    <RichTextEditor
                      content={promoForm.description}
                      onChange={(description) => setPromoForm({ ...promoForm, description })}
                      placeholder="Décrivez les détails de l'offre..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg" className="flex-1 md:flex-none">
                      <Save className="w-4 h-4 mr-2" />
                      {editingPromo ? "Mettre à jour" : "Créer le code promo"}
                    </Button>
                    {editingPromo && (
                      <Button type="button" variant="outline" size="lg" onClick={handleCancelEdit}>
                        Annuler
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Gestion des articles existants */}
        {activeTab === "articles" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Articles existants</h3>
              {editingArticle && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <Edit className="w-4 h-4" />
                  Mode édition
                </div>
              )}
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : articles.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun article trouvé</p>
              ) : (
                articles.map((article) => (
                  <Card key={article.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{article.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {article.category} • {article.author} • {new Date(article.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditArticle(article)}
                          className="text-primary hover:text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Gestion des promos existantes */}
        {activeTab === "promos" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Codes promo existants</h3>
              {editingPromo && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <Edit className="w-4 h-4" />
                  Mode édition
                </div>
              )}
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : promos.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun code promo trouvé</p>
              ) : (
                promos.map((promo) => (
                  <Card key={promo.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{promo.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {promo.partner} • {promo.code} • {formatDiscount(promo.discount)} • Valide jusqu'au {new Date(promo.valid_until).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPromo(promo)}
                          className="text-primary hover:text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePromo(promo.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Admin;