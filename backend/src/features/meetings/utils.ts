import { MeetingFieldMinistry } from './enums';
import { FieldMinistryInput } from './types';

export function parseFieldMinistryInput(input: any): FieldMinistryInput[] {
	if (!Array.isArray(input)) return [];

	return input.map((item) => {
		const taskTitle = item.taskTitle as MeetingFieldMinistry;

		return {
			...item,
			taskTitle,
		};
	});
}
