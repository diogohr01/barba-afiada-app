
/**
 * Utilitário para gerenciar chamadas de API com tratamento padronizado de erros
 */

import { toast } from "@/hooks/use-toast";

/**
 * Mensagens de erro padrão por código HTTP
 */
const errorMessages = {
  400: "Requisição inválida. Verifique os dados enviados.",
  401: "Não autorizado. Faça login novamente.",
  403: "Você não tem permissão para acessar este recurso.",
  404: "O recurso solicitado não foi encontrado.",
  408: "Tempo de requisição esgotado. Tente novamente.",
  409: "Conflito com o estado atual do recurso.",
  429: "Muitas requisições. Aguarde alguns instantes.",
  500: "Erro no servidor. Tente novamente mais tarde.",
  503: "Serviço indisponível. Tente novamente mais tarde.",
};

/**
 * Função para realizar requisições HTTP com tratamento de erros
 * @param {string} url - URL da requisição
 * @param {Object} options - Opções para fetch (method, headers, body, etc)
 * @param {Object} customErrors - Mensagens de erro customizadas por código
 * @returns {Promise} - Resultado da requisição ou erro tratado
 */
export const apiRequest = async (url, options = {}, customErrors = {}) => {
  try {
    // Configurações padrão
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        // Aqui você pode adicionar tokens de autenticação:
        // "Authorization": `Bearer ${getToken()}`
      },
    };

    // Mesclar opções
    const fetchOptions = { ...defaultOptions, ...options };
    
    // Realizar a requisição
    const response = await fetch(url, fetchOptions);
    
    // Verificar status da resposta
    if (!response.ok) {
      const statusCode = response.status;
      
      // Obter mensagem de erro personalizada ou padrão
      const errorMessage = 
        customErrors[statusCode] || 
        errorMessages[statusCode] || 
        `Erro desconhecido (${statusCode})`;
      
      // Tentar obter detalhes do erro da resposta
      let errorDetails;
      try {
        errorDetails = await response.json();
      } catch (e) {
        errorDetails = { message: "Sem detalhes disponíveis" };
      }
      
      // Mostrar toast com mensagem de erro
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Criar e lançar um erro com os detalhes
      const error = new Error(errorMessage);
      error.status = statusCode;
      error.details = errorDetails;
      throw error;
    }
    
    // Em caso de sucesso, retornar os dados
    const data = await response.json();
    return data;
    
  } catch (error) {
    // Verificar se é um erro de rede/conexão
    if (!error.status) {
      toast({
        title: "Erro de conexão",
        description: "Verifique sua conexão com a internet.",
        variant: "destructive",
      });
    }
    
    // Propagar erro para tratamento adicional se necessário
    throw error;
  }
};

/**
 * Métodos de API com verbos HTTP comuns
 */
export const api = {
  /**
   * Requisição GET
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções adicionais
   * @param {Object} customErrors - Mensagens de erro customizadas
   */
  get: (url, options = {}, customErrors = {}) => 
    apiRequest(url, { ...options, method: "GET" }, customErrors),
  
  /**
   * Requisição POST
   * @param {string} url - URL da requisição
   * @param {Object} data - Dados para enviar no corpo
   * @param {Object} options - Opções adicionais
   * @param {Object} customErrors - Mensagens de erro customizadas
   */
  post: (url, data, options = {}, customErrors = {}) => 
    apiRequest(
      url, 
      { 
        ...options, 
        method: "POST", 
        body: JSON.stringify(data) 
      }, 
      customErrors
    ),
  
  /**
   * Requisição PUT
   * @param {string} url - URL da requisição
   * @param {Object} data - Dados para enviar no corpo
   * @param {Object} options - Opções adicionais
   * @param {Object} customErrors - Mensagens de erro customizadas
   */
  put: (url, data, options = {}, customErrors = {}) => 
    apiRequest(
      url, 
      { 
        ...options, 
        method: "PUT", 
        body: JSON.stringify(data) 
      }, 
      customErrors
    ),
  
  /**
   * Requisição DELETE
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções adicionais
   * @param {Object} customErrors - Mensagens de erro customizadas
   */
  delete: (url, options = {}, customErrors = {}) => 
    apiRequest(url, { ...options, method: "DELETE" }, customErrors),
};

/**
 * Hook personalizado para useQuery com tratamento de erro padrão
 * Exemplo de uso com React Query
 */
export const useApiQuery = (queryKey, url, options = {}) => {
  // Importar useQuery do react-query (supondo que já exista no projeto)
  // import { useQuery } from '@tanstack/react-query';
  
  return useQuery({
    queryKey: queryKey,
    queryFn: () => api.get(url),
    ...options,
    onError: (error) => {
      console.error('Erro na consulta:', error);
      // Chame o handler personalizado depois do tratamento padrão
      if (options.onError) options.onError(error);
    }
  });
};
