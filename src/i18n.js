import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Diccionarios de Traducción Multilingües para Admin Review Hub (SPEC-CORE-44 / SPEC-CORE-45)
const resources = {
  es: {
    translation: {
      admin_title: "AI Pods — Admin Review Hub & Gobernanza",
      pending_approvals: "Revisiones Pendientes",
      btn_approve: "Aprobar Ejecución",
      btn_reject: "Rechazar",
      status_approved: "Aprobado",
      status_rejected: "Rechazado",
      audit_trail: "Registro de Auditoría IAM SHA-256",
      llm_models_action: "Modelos LLM",
      llm_models_title: "Modelos LLM del tenant",
      llm_models_subtitle: "Modelo de Claude por tarea y cadena de respaldo para {{tenant}}.",
      llm_models_close: "Cerrar",
      llm_models_loading: "Cargando la configuración…",
      llm_models_load_error: "No se pudo cargar la configuración de modelos.",
      llm_models_save_error: "No se pudo guardar la configuración de modelos.",
      llm_models_saved: "Configuración guardada.",
      llm_models_task_classify: "Clasificar",
      llm_models_task_expand: "Expandir",
      llm_models_task_answer: "Redactar",
      llm_models_inherit: "Heredar de la plataforma ({{model}})",
      llm_models_effective: "Modelo efectivo: {{model}}",
      llm_models_fallback: "Cadena de respaldo",
      llm_models_fallback_inherit: "Heredar de la plataforma ({{chain}})",
      llm_models_fallback_empty: "Sin modelos: este tenant no usa respaldo.",
      llm_models_fallback_add_label: "Agregar modelo de respaldo",
      llm_models_fallback_max: "Máximo de {{max}} modelos de respaldo.",
      llm_models_fallback_effective: "Cadena efectiva: {{chain}}",
      llm_models_no_chain: "sin respaldo",
      llm_models_choose: "Elegir modelo",
      llm_models_add: "Agregar",
      llm_models_remove: "Quitar",
      llm_models_move_up: "Subir {{model}}",
      llm_models_move_down: "Bajar {{model}}",
      llm_models_save: "Guardar",
      llm_models_saving: "Guardando…",
      llm_models_reload: "Descartar cambios"
    }
  },
  pt: {
    translation: {
      admin_title: "AI Pods — Admin Review Hub & Governança",
      pending_approvals: "Revisões Pendentes",
      btn_approve: "Aprovar Execução",
      btn_reject: "Rejeitar",
      status_approved: "Aprovado",
      status_rejected: "Rejeitado",
      audit_trail: "Trilha de Auditoria IAM SHA-256"
    }
  },
  en: {
    translation: {
      admin_title: "AI Pods — Admin Review Hub & Governance",
      pending_approvals: "Pending Reviews",
      btn_approve: "Approve Execution",
      btn_reject: "Reject",
      status_approved: "Approved",
      status_rejected: "Rejected",
      audit_trail: "IAM SHA-256 Audit Trail",
      llm_models_action: "LLM models",
      llm_models_title: "Tenant LLM models",
      llm_models_subtitle: "Claude model per task and fallback chain for {{tenant}}.",
      llm_models_close: "Close",
      llm_models_loading: "Loading configuration…",
      llm_models_load_error: "Could not load the model configuration.",
      llm_models_save_error: "Could not save the model configuration.",
      llm_models_saved: "Configuration saved.",
      llm_models_task_classify: "Classify",
      llm_models_task_expand: "Expand",
      llm_models_task_answer: "Answer",
      llm_models_inherit: "Inherit from platform ({{model}})",
      llm_models_effective: "Effective model: {{model}}",
      llm_models_fallback: "Fallback chain",
      llm_models_fallback_inherit: "Inherit from platform ({{chain}})",
      llm_models_fallback_empty: "No models: this tenant uses no fallback.",
      llm_models_fallback_add_label: "Add fallback model",
      llm_models_fallback_max: "At most {{max}} fallback models.",
      llm_models_fallback_effective: "Effective chain: {{chain}}",
      llm_models_no_chain: "no fallback",
      llm_models_choose: "Choose a model",
      llm_models_add: "Add",
      llm_models_remove: "Remove",
      llm_models_move_up: "Move {{model}} up",
      llm_models_move_down: "Move {{model}} down",
      llm_models_save: "Save",
      llm_models_saving: "Saving…",
      llm_models_reload: "Discard changes"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
