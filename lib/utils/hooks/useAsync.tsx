import React from "react";
import type { Reducer } from "react";

enum AsyncActionType {
	loading = "loading",
	resolved = "resolved",
	rejected = "rejected",
	reset = "idle",
}
export type StatusTypes = "idle" | "loading" | "resolved" | "rejected";

type AsyncReducerState = {
	status: StatusTypes;
	data: unknown | null;
	error: Error | null;
};

type AsyncAction =
	| { type: AsyncActionType.loading }
	| { type: AsyncActionType.resolved; data: unknown }
	| { type: AsyncActionType.rejected; error: Error }
	| { type: AsyncActionType.reset; data: null; error: null };

type InitialStateProps =
	| {
			status: "idle" | "loading" | "resolved" | "rejected";
			data: unknown | null;
			error: Error | null;
	  }
	| {};

const asyncReducer: Reducer<AsyncReducerState, AsyncAction> = (
	state,
	action
) => {
	switch (action.type) {
		case AsyncActionType.loading: {
			return { status: "loading", data: null, error: null };
		}
		case AsyncActionType.resolved: {
			return { status: "resolved", data: action.data, error: null };
		}
		case AsyncActionType.rejected: {
			return { status: "rejected", data: null, error: action.error };
		}
		case AsyncActionType.reset: {
			return { status: "idle", data: null, error: null };
		}
		default: {
			throw new Error(`Unhandled action type`);
		}
	}
};

const useAsync = (initialState: InitialStateProps = {}) => {
	const [state, dispatch] = React.useReducer(asyncReducer, {
		status: "idle",
		data: null,
		error: null,
		...initialState,
	});

	const { data, error, status } = state;

	const run = React.useCallback((promise: Promise<unknown>) => {
		dispatch({ type: AsyncActionType.loading });
		promise.then(
			(data: unknown) => dispatch({ type: AsyncActionType.resolved, data }),
			(error: Error) => dispatch({ type: AsyncActionType.rejected, error })
		);
	}, []);

	const reset = () =>
		dispatch({ type: AsyncActionType.reset, data: null, error: null });

	const setData = React.useCallback(
		(data: unknown) => dispatch({ type: AsyncActionType.resolved, data }),
		[dispatch]
	);

	return {
		error,
		status,
		data,
		setData,
		run,
		reset,
	};
};

export default useAsync;
