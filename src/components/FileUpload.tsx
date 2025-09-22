import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
  onFileRemoved: () => void;
  currentFile?: string;
  accept?: string;
  maxSize?: number; // en MB
  className?: string;
}

const FileUpload = ({
  onFileUploaded,
  onFileRemoved,
  currentFile,
  accept = ".pdf",
  maxSize = 10, // 10MB par défaut
  className = ""
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    // Validation du type de fichier
    if (!file.type.includes('pdf')) {
      toast({
        title: "Type de fichier invalide",
        description: "Seuls les fichiers PDF sont acceptés.",
        variant: "destructive"
      });
      return;
    }

    // Validation de la taille
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `Le fichier ne doit pas dépasser ${maxSize}MB.`,
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload du fichier vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Obtenir l'URL publique du fichier
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      onFileUploaded(publicUrl);

      toast({
        title: "Fichier uploadé !",
        description: "Le document a été uploadé avec succès.",
      });

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader le fichier. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveFile = async () => {
    if (currentFile) {
      try {
        // Extraire le chemin du fichier depuis l'URL
        const url = new URL(currentFile);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts.slice(-2).join('/'); // documents/filename.pdf

        // Supprimer le fichier du storage
        await supabase.storage
          .from('documents')
          .remove([filePath]);

        onFileRemoved();

        toast({
          title: "Fichier supprimé",
          description: "Le document a été supprimé avec succès.",
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast({
          title: "Erreur de suppression",
          description: "Impossible de supprimer le fichier.",
          variant: "destructive"
        });
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>Document PDF</Label>
      
      {currentFile ? (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="font-medium">Document PDF</p>
              <p className="text-sm text-muted-foreground">
                Fichier uploadé avec succès
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(currentFile, '_blank')}
            >
              Voir
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveFile}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={uploading}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Upload en cours...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  Glissez-déposez un fichier PDF ici
                </p>
                <p className="text-xs text-muted-foreground">
                  ou cliquez pour sélectionner
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Taille max: {maxSize}MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
