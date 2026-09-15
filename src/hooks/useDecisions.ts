import { useCallback, useEffect, useReducer } from "react";
import { getDecisions } from "../api/decisions";
import type { Decision } from "../types/decision";

type DecisionsState = {
  decisions: Decision[];
  loading: boolean;
  error: string | null;
};

type DecisionsAction =
  | { type: "fetch/start" }
  | { type: "fetch/success"; payload: Decision[] }
  | { type: "fetch/error"; payload: string }
  | { type: "add"; payload: Decision }
  | { type: "update"; payload: Decision }
  | { type: "delete"; payload: string }
  | { type: "toggle-status"; payload: string };

const initialState: DecisionsState = {
  decisions: [],
  loading: true,
  error: null,
};

function decisionsReducer(
  state: DecisionsState,
  action: DecisionsAction,
): DecisionsState {
  switch (action.type) {
    case "fetch/start":
      return { ...state, loading: true, error: null };
    case "fetch/success":
      return { decisions: action.payload, loading: false, error: null };
    case "fetch/error":
      return { ...state, loading: false, error: action.payload };
    case "add":
      return { ...state, decisions: [action.payload, ...state.decisions] };
    case "update":
      return {
        ...state,
        decisions: state.decisions.map((decision) =>
          decision.id === action.payload.id ? action.payload : decision,
        ),
      };
    case "delete":
      return {
        ...state,
        decisions: state.decisions.filter(
          (decision) => decision.id !== action.payload,
        ),
      };
    case "toggle-status":
      return {
        ...state,
        decisions: state.decisions.map((decision) =>
          decision.id === action.payload
            ? { ...decision, active: !decision.active }
            : decision,
        ),
      };
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to load decisions.";
}

export function useDecisions() {
  const [state, dispatch] = useReducer(decisionsReducer, initialState);

  const fetchDecisions = useCallback(async () => {
    dispatch({ type: "fetch/start" });

    try {
      const decisions = await getDecisions();
      dispatch({ type: "fetch/success", payload: decisions });
    } catch (error) {
      dispatch({ type: "fetch/error", payload: getErrorMessage(error) });
    }
  }, []);

  useEffect(() => {
    void fetchDecisions();
  }, [fetchDecisions]);

  const addDecision = useCallback((decision: Omit<Decision, "id">) => {
    dispatch({
      type: "add",
      payload: { ...decision, id: crypto.randomUUID() },
    });
  }, []);

  const updateDecision = useCallback((decision: Decision) => {
    dispatch({ type: "update", payload: decision });
  }, []);

  const deleteDecision = useCallback((id: string) => {
    dispatch({ type: "delete", payload: id });
  }, []);

  const toggleDecisionStatus = useCallback((id: string) => {
    dispatch({ type: "toggle-status", payload: id });
  }, []);

  return {
    decisions: state.decisions,
    loading: state.loading,
    error: state.error,
    fetchDecisions,
    addDecision,
    updateDecision,
    deleteDecision,
    toggleDecisionStatus,
  };
}
