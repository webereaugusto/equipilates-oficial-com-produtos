import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product, Category } from '../../lib/database.types';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  hideHeader?: boolean;
}

export default function ProductForm({ product, categories, hideHeader = false }: ProductFormProps) {
  const isEditing = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'seo' | 'images'>('basic');
  const [formData, setFormData] = useState({
    category_id: product?.category_id || '',
    title: product?.title || '',
    slug: product?.slug || '',
    short_description: product?.short_description || '',
    detailed_description: product?.detailed_description || '',
    technical_specs: Array.isArray(product?.technical_specs) ? product.technical_specs : [],
    price: product?.price?.toString() || '',
    optional_items: Array.isArray(product?.optional_items) ? product.optional_items : [],
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
    seo_keywords: product?.seo_keywords || '',
    seo_text: product?.seo_text || '',
    is_active: product?.is_active ?? true,
    order_index: product?.order_index?.toString() || '0'
  });

  const [newSpec, setNewSpec] = useState('');
  const [newOptionalKey, setNewOptionalKey] = useState('');
  const [newOptionalValue, setNewOptionalValue] = useState('');
  
  const [images, setImages] = useState<Array<{ id?: string; url: string; file?: File; isNew?: boolean }>>([]);
  const [imagesToDelete, setImagesToDelete] = useState<Array<{ id: string; url: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load existing images
  useEffect(() => {
    if (product?.id) {
      loadProductImages();
    }
  }, [product?.id]);

  const loadProductImages = async () => {
    if (!product?.id) return;
    
    const { data } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', product.id)
      .order('order_index');
    
    if (data) {
      setImages(data.map(img => ({ id: img.id, url: img.url })));
    }
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newImages = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      file,
      isNew: true
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    
    // Se a imagem já existe no banco (tem ID), adiciona à lista de exclusão
    if (imageToRemove.id && !imageToRemove.isNew) {
      setImagesToDelete(prev => [...prev, { id: imageToRemove.id!, url: imageToRemove.url }]);
    }
    
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addSpec = () => {
    if (newSpec.trim()) {
      setFormData(prev => ({
        ...prev,
        technical_specs: [...(prev.technical_specs as string[]), newSpec.trim()]
      }));
      setNewSpec('');
    }
  };

  const removeSpec = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technical_specs: (prev.technical_specs as string[]).filter((_, i) => i !== index)
    }));
  };

  const addOptionalItem = () => {
    if (newOptionalKey.trim() && newOptionalValue.trim()) {
      setFormData(prev => ({
        ...prev,
        optional_items: [...(prev.optional_items as any[]), {
          key: newOptionalKey.trim(),
          value: newOptionalValue.trim()
        }]
      }));
      setNewOptionalKey('');
      setNewOptionalValue('');
    }
  };

  const removeOptionalItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      optional_items: (prev.optional_items as any[]).filter((_, i) => i !== index)
    }));
  };

  const deleteImages = async () => {
    for (const img of imagesToDelete) {
      // Deletar do banco de dados
      await supabase
        .from('product_images')
        .delete()
        .eq('id', img.id);
      
      // Extrair o path do arquivo da URL para deletar do storage
      // URL formato: https://xxx.supabase.co/storage/v1/object/public/product-images/productId/filename.ext
      try {
        const url = new URL(img.url);
        const pathMatch = url.pathname.match(/\/product-images\/(.+)$/);
        if (pathMatch) {
          const filePath = pathMatch[1];
          await supabase.storage
            .from('product-images')
            .remove([filePath]);
        }
      } catch (e) {
        console.error('Erro ao deletar arquivo do storage:', e);
      }
    }
    
    // Limpar a lista de imagens a deletar
    setImagesToDelete([]);
  };

  const uploadImages = async (productId: string) => {
    const newImages = images.filter(img => img.isNew && img.file);
    
    for (let i = 0; i < newImages.length; i++) {
      const img = newImages[i];
      if (!img.file) continue;
      
      const fileExt = img.file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, img.file);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      await supabase.from('product_images').insert({
        product_id: productId,
        url: publicUrl,
        is_primary: i === 0 && images.indexOf(img) === 0,
        order_index: images.indexOf(img)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const productData = {
        category_id: formData.category_id,
        title: formData.title,
        slug: formData.slug,
        short_description: formData.short_description,
        detailed_description: formData.detailed_description,
        technical_specs: formData.technical_specs,
        price: parseFloat(formData.price),
        optional_items: formData.optional_items.length > 0 ? formData.optional_items : null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        seo_keywords: formData.seo_keywords || null,
        seo_text: formData.seo_text || null,
        is_active: formData.is_active,
        order_index: parseInt(formData.order_index) || 0
      };

      let productId = product?.id;

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (updateError) throw updateError;
      } else {
        const { data, error: insertError } = await supabase
          .from('products')
          .insert(productData)
          .select('id')
          .single();

        if (insertError) throw insertError;
        productId = data.id;
      }

      // Deletar imagens marcadas para exclusão
      if (imagesToDelete.length > 0) {
        await deleteImages();
      }

      // Upload new images
      if (productId) {
        setUploading(true);
        await uploadImages(productId);
        setUploading(false);
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/admin/produtos';
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="product-form-container">
      {/* Header */}
      {!hideHeader && (
        <div className="form-header">
          <div className="header-info">
            <h2>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
            <p>{isEditing ? 'Atualize as informações do produto' : 'Preencha os campos para criar um novo produto'}</p>
          </div>
          <div className="header-actions">
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="slider"></span>
              <span className="switch-label">{formData.is_active ? 'Ativo' : 'Inativo'}</span>
            </label>
          </div>
        </div>
      )}
      
      {hideHeader && (
        <div className="form-header-minimal">
          <label className="switch">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <span className="slider"></span>
            <span className="switch-label">{formData.is_active ? 'Ativo' : 'Inativo'}</span>
          </label>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span>Produto salvo com sucesso! Redirecionando...</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          Informações Básicas
        </button>
        <button 
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Especificações
        </button>
        <button 
          className={`tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Imagens
        </button>
        <button 
          className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
          onClick={() => setActiveTab('seo')}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          SEO
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        <div className={`tab-content ${activeTab === 'basic' ? 'active' : ''}`}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Categoria <span className="required">*</span></label>
              <div className="category-select">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-option ${formData.category_id === cat.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, category_id: cat.id })}
                  >
                    <span className="category-dot"></span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group full">
              <label>Título do Produto <span className="required">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Cadillac Aluminum - Aparelho de Pilates Clássico"
                required
              />
            </div>

            <div className="form-group">
              <label>Slug (URL) <span className="required">*</span></label>
              <div className="input-with-prefix">
                <span className="prefix">/produtos/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Preço <span className="required">*</span></label>
              <div className="input-with-prefix">
                <span className="prefix">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="14990.00"
                  required
                />
              </div>
              {formData.price && (
                <span className="input-hint">{formatCurrency(formData.price)}</span>
              )}
            </div>

            <div className="form-group full">
              <label>Descrição Curta <span className="required">*</span></label>
              <textarea
                rows={3}
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Uma breve descrição do produto (será exibida nos cards)"
                required
              />
              <span className="input-hint">{formData.short_description.length}/200 caracteres</span>
            </div>

            <div className="form-group full">
              <label>Descrição Detalhada <span className="required">*</span></label>
              <textarea
                rows={6}
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                placeholder="Descrição completa do produto com todos os detalhes"
                required
              />
            </div>
          </div>
        </div>

        {/* Details Tab */}
        <div className={`tab-content ${activeTab === 'details' ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Dados Técnicos</h3>
            <p className="section-desc">Adicione as especificações técnicas do produto (uma por vez)</p>
            
            <div className="add-item-row">
              <input
                type="text"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Ex: 02 Molas para Perna"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
              />
              <button type="button" className="btn-add" onClick={addSpec}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Adicionar
              </button>
            </div>

            <div className="items-list">
              {(formData.technical_specs as string[]).map((spec, index) => (
                <div key={index} className="item-tag">
                  <span>{spec}</span>
                  <button type="button" onClick={() => removeSpec(index)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
              {(formData.technical_specs as string[]).length === 0 && (
                <p className="empty-message">Nenhuma especificação adicionada</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Opcionais / Variações</h3>
            <p className="section-desc">Adicione variações ou opções do produto (Ex: Cor, Tamanho, Material)</p>
            
            <div className="add-item-row optional">
              <input
                type="text"
                value={newOptionalKey}
                onChange={(e) => setNewOptionalKey(e.target.value)}
                placeholder="Título (ex: Cor)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionalItem())}
              />
              <input
                type="text"
                value={newOptionalValue}
                onChange={(e) => setNewOptionalValue(e.target.value)}
                placeholder="Valor (ex: Azul)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionalItem())}
              />
              <button type="button" className="btn-add-icon" onClick={addOptionalItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>

            <div className="items-list">
              {(formData.optional_items as any[]).map((item, index) => (
                <div key={index} className="item-tag optional">
                  <span className="item-key">{item.key || item.name}:</span>
                  <span className="item-value">{item.value || (item.price ? formatCurrency(item.price.toString()) : '')}</span>
                  <button type="button" onClick={() => removeOptionalItem(index)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
              {(formData.optional_items as any[]).length === 0 && (
                <p className="empty-message">Nenhuma variação adicionada</p>
              )}
            </div>
          </div>
        </div>

        {/* Images Tab */}
        <div className={`tab-content ${activeTab === 'images' ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Imagens do Produto</h3>
            <p className="section-desc">Arraste imagens ou clique para fazer upload. A primeira imagem será a principal.</p>

            <div 
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
              onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('dragover'); }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('dragover');
                handleImageUpload(e.dataTransfer.files);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
                style={{ display: 'none' }}
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p>Arraste imagens aqui ou <span>clique para selecionar</span></p>
              <small>PNG, JPG, WebP até 5MB</small>
            </div>

            {images.length > 0 && (
              <div className="images-grid">
                {images.map((img, index) => (
                  <div key={index} className={`image-card ${index === 0 ? 'primary' : ''}`}>
                    {index === 0 && <span className="primary-badge">Principal</span>}
                    <img src={img.url} alt={`Imagem ${index + 1}`} />
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                    {img.isNew && <span className="new-badge">Nova</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEO Tab */}
        <div className={`tab-content ${activeTab === 'seo' ? 'active' : ''}`}>
          <div className="form-section">
            <h3>Otimização para Buscadores</h3>
            <p className="section-desc">Configure como seu produto aparecerá nos resultados de busca do Google</p>

            <div className="seo-preview">
              <div className="preview-title">{formData.seo_title || formData.title || 'Título do Produto'} | Equipilates</div>
              <div className="preview-url">equipilates.com.br/produtos/{formData.slug || 'slug-do-produto'}</div>
              <div className="preview-desc">{formData.seo_description || formData.short_description || 'Descrição do produto aparecerá aqui...'}</div>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Meta Title</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="Título otimizado para SEO"
                />
                <span className="input-hint">{formData.seo_title.length}/60 caracteres recomendados</span>
              </div>

              <div className="form-group full">
                <label>Meta Description</label>
                <textarea
                  rows={3}
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Descrição para mecanismos de busca"
                />
                <span className="input-hint">{formData.seo_description.length}/160 caracteres recomendados</span>
              </div>

              <div className="form-group full">
                <label>Palavras-chave</label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                  placeholder="pilates, equipamento, reformer, cadillac"
                />
              </div>

              <div className="form-group full">
                <label>Texto SEO Completo</label>
                <textarea
                  rows={5}
                  value={formData.seo_text}
                  onChange={(e) => setFormData({ ...formData, seo_text: e.target.value })}
                  placeholder="Texto rico em palavras-chave para melhorar o posicionamento"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <a href="/admin/produtos" className="btn-cancel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Cancelar
          </a>
          <button type="submit" className="btn-save" disabled={loading || uploading}>
            {loading || uploading ? (
              <>
                <span className="spinner"></span>
                {uploading ? 'Enviando imagens...' : 'Salvando...'}
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                {isEditing ? 'Salvar Alterações' : 'Criar Produto'}
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        .product-form-container {
          max-width: 900px;
          overflow: hidden;
        }

        .product-form-container * {
          box-sizing: border-box;
        }

        /* Header */
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .form-header-minimal {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .header-info h2 {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .header-info p {
          color: #888;
          font-size: 0.9rem;
        }

        /* Switch */
        .switch {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .switch input {
          display: none;
        }

        .slider {
          width: 48px;
          height: 26px;
          background: #333;
          border-radius: 26px;
          position: relative;
          transition: 0.3s;
        }

        .slider:before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: 0.3s;
        }

        .switch input:checked + .slider {
          background: #22c55e;
        }

        .switch input:checked + .slider:before {
          transform: translateX(22px);
        }

        .switch-label {
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Alerts */
        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .alert svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .alert-success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        /* Tabs */
        .tabs {
          display: flex;
          gap: 4px;
          background: rgba(255,255,255,0.03);
          padding: 6px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background: transparent;
          color: #888;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
        }

        .tab svg {
          width: 18px;
          height: 18px;
        }

        .tab:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .tab.active {
          background: #D4A574;
          color: #000;
        }

        /* Tab Content */
        .tab-content {
          display: none;
        }

        .tab-content.active {
          display: block;
        }

        /* Form Elements */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full {
          grid-column: span 2;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #aaa;
        }

        .required {
          color: #D4A574;
        }

        input, textarea, select {
          padding: 12px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #D4A574;
          background: rgba(212, 165, 116, 0.05);
        }

        input::placeholder, textarea::placeholder {
          color: #555;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        .input-hint {
          font-size: 0.8rem;
          color: #666;
        }

        .input-with-prefix {
          display: flex;
          align-items: stretch;
        }

        .input-with-prefix .prefix {
          padding: 12px 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          border-right: none;
          border-radius: 8px 0 0 8px;
          color: #888;
          font-size: 0.9rem;
        }

        .input-with-prefix input {
          border-radius: 0 8px 8px 0;
          flex: 1;
        }

        .input-with-prefix.small {
          max-width: 150px;
        }

        /* Category Select */
        .category-select {
          display: flex;
          gap: 12px;
        }

        .category-option {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #888;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-option:hover {
          border-color: rgba(212, 165, 116, 0.3);
          color: #fff;
        }

        .category-option.selected {
          border-color: #D4A574;
          background: rgba(212, 165, 116, 0.1);
          color: #D4A574;
        }

        .category-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.5;
        }

        .category-option.selected .category-dot {
          opacity: 1;
        }

        /* Form Sections */
        .form-section {
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .form-section h3 {
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .section-desc {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        /* Add Item Row */
        .add-item-row {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .add-item-row input {
          flex: 1;
          min-width: 0;
        }

        .add-item-row.optional input {
          flex: 1;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: #D4A574;
          color: #000;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-add:hover {
          background: #c4955e;
        }

        .btn-add svg {
          width: 18px;
          height: 18px;
        }

        /* Items List */
        .items-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          max-width: 100%;
          overflow: hidden;
        }

        .item-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          font-size: 0.85rem;
          max-width: 100%;
          line-height: 1.4;
        }

        .item-tag > span:first-child {
          word-break: break-word;
          flex: 1;
          min-width: 0;
        }

        .item-tag.optional {
          background: rgba(212, 165, 116, 0.1);
        }

        .item-tag .item-key {
          color: #888;
          font-weight: 500;
          flex-shrink: 0;
        }

        .item-tag .item-value {
          color: #D4A574;
          font-weight: 600;
        }

        .item-tag button {
          display: flex;
          padding: 4px;
          background: none;
          color: #666;
          border-radius: 4px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .item-tag button:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .item-tag button svg {
          width: 14px;
          height: 14px;
        }

        .empty-message {
          color: #555;
          font-size: 0.9rem;
          font-style: italic;
        }

        .btn-add-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          padding: 0;
          background: #D4A574;
          color: #000;
          border-radius: 8px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .btn-add-icon:hover {
          background: #c4955e;
        }

        .btn-add-icon svg {
          width: 20px;
          height: 20px;
        }

        /* Upload Area */
        .upload-area {
          border: 2px dashed rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 20px;
        }

        .upload-area:hover, .upload-area.dragover {
          border-color: #D4A574;
          background: rgba(212, 165, 116, 0.05);
        }

        .upload-area svg {
          width: 48px;
          height: 48px;
          color: #555;
          margin-bottom: 12px;
        }

        .upload-area p {
          color: #888;
          margin-bottom: 4px;
        }

        .upload-area span {
          color: #D4A574;
          font-weight: 500;
        }

        .upload-area small {
          color: #555;
        }

        /* Images Grid */
        .images-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .image-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid transparent;
        }

        .image-card.primary {
          border-color: #D4A574;
        }

        .image-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .primary-badge, .new-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .primary-badge {
          background: #D4A574;
          color: #000;
        }

        .new-badge {
          background: #22c55e;
          color: #fff;
          top: auto;
          bottom: 8px;
        }

        .remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.7);
          border-radius: 6px;
          color: #fff;
          opacity: 0;
          transition: all 0.2s;
        }

        .image-card:hover .remove-btn {
          opacity: 1;
        }

        .remove-btn:hover {
          background: #ef4444;
        }

        .remove-btn svg {
          width: 16px;
          height: 16px;
        }

        /* SEO Preview */
        .seo-preview {
          background: #fff;
          padding: 16px;
          border-radius: 10px;
          margin-bottom: 24px;
        }

        .preview-title {
          color: #1a0dab;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }

        .preview-url {
          color: #006621;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .preview-desc {
          color: #545454;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .btn-cancel, .btn-save {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: rgba(255,255,255,0.05);
          color: #888;
          text-decoration: none;
        }

        .btn-cancel:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }

        .btn-save {
          background: #D4A574;
          color: #000;
          border: none;
        }

        .btn-save:hover {
          background: #c4955e;
          transform: translateY(-1px);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-cancel svg, .btn-save svg {
          width: 18px;
          height: 18px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full {
            grid-column: span 1;
          }

          .tabs {
            flex-wrap: wrap;
          }

          .tab {
            flex: 1 1 45%;
            padding: 10px 12px;
            font-size: 0.8rem;
          }

          .category-select {
            flex-direction: column;
          }

          .images-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .add-item-row {
            flex-wrap: wrap;
          }

          .add-item-row input {
            flex: 1 1 calc(50% - 6px);
            min-width: 120px;
          }

          .add-item-row.optional {
            flex-wrap: nowrap;
          }

          .add-item-row.optional input {
            flex: 1;
            min-width: 0;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-cancel, .btn-save {
            justify-content: center;
          }

          .form-section {
            padding: 16px;
          }

          .item-tag {
            font-size: 0.8rem;
            padding: 6px 10px;
          }
        }
      `}</style>
    </div>
  );
}
