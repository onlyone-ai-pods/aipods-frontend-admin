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
      audit_trail: "Registro de Auditoría IAM SHA-256"
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
      audit_trail: "IAM SHA-256 Audit Trail"
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
