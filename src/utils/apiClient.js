
import { toast } from "@/hooks/use-toast";
import { APP_CONFIG } from "../config/appConfig";

/**
 * API Client with error handling
 */
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || "/api";
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Handle API errors and display appropriate messages
   */
  handleError(error, customMessage) {
    console.error("API Error:", error);
    
    let message = customMessage || "Ocorreu um erro. Por favor, tente novamente.";
    let title = "Erro";
    
    // Handle specific status codes
    if (error.status) {
      switch (error.status) {
        case 400:
          title = "Dados inválidos";
          message = error.message || "Por favor, verifique os dados e tente novamente.";
          break;
        case 401:
          title = "Não autorizado";
          message = "Você não está autorizado a realizar esta ação.";
          break;
        case 403:
          title = "Acesso negado";
          message = "Você não tem permissão para acessar este recurso.";
          break;
        case 404:
          title = "Não encontrado";
          message = "O recurso solicitado não foi encontrado.";
          break;
        case 409:
          title = "Conflito";
          message = "Já existe um agendamento para este horário.";
          break;
        case 429:
          title = "Muitas solicitações";
          message = "Por favor, aguarde um momento antes de tentar novamente.";
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          title = "Erro no servidor";
          message = "Nossos servidores estão com problemas. Por favor, tente novamente mais tarde.";
          break;
        default:
          break;
      }
    }
    
    // Display toast notification
    toast({
      title,
      description: message,
      variant: "destructive",
    });
    
    return Promise.reject(error);
  }

  /**
   * Make API request with error handling
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = { ...this.defaultHeaders, ...options.headers };
      
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          status: response.status,
          message: errorData.message || response.statusText,
          data: errorData,
        };
      }
      
      // Check if response should be parsed as JSON or text
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      return this.handleError(error);
    }
  }

  // HTTP methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient("/api");
