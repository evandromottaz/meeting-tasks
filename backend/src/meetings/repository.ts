import Database from 'better-sqlite3';
import { MeetingInput, MeetingOutput, IMeetingRepository } from './types';

type MeetingRow = {
	date_iso: string;
	chairman_id: number;
	chairman_name: string;
	treasures_talker_id: number;
	treasures_talker_name: string;
	treasures_title: string;
	spiritual_gems_director_id: number;
	spiritual_gems_director_name: string;
	book_study_director_id: number;
	book_study_director_name: string;
	book_study_reader_id: number;
	book_study_reader_name: string;
};

type FieldMinistryRow = {
	id: number;
	meeting_date: string;
	student_id: number;
	student_name: string;
	helper_id: number | null;
	helper_name: string | null;
	title: string | null;
	type: string;
};

type ChristianLifeRow = {
	id: number;
	meeting_date: string;
	director_id: number;
	director_name: string;
	title: string;
};

export class MeetingRepository implements IMeetingRepository {
	constructor(readonly db: InstanceType<typeof Database>) {
		this.db = db;
	}

	create({ date, ...meeting }: MeetingInput): MeetingOutput {
		const meetingOverviewTransaction = this.db.transaction(() => {
			const meetingSQLMapper = new Map<keyof MeetingRow, string | number | undefined>([
				['date_iso', date],
				['chairman_id', meeting.chairmanId],
				['treasures_talker_id', meeting.treasuresTalkerId],
				['treasures_title', meeting.treasuresTitle],
				['spiritual_gems_director_id', meeting.spiritualGemsDirectorId],
				['book_study_director_id', meeting.bookStudyDirectorId],
				['book_study_reader_id', meeting.bookStudyReaderId],
			]);

			const meetingEntries = [...meetingSQLMapper.entries()].filter((entry) => entry[1] !== undefined);
			const meetingKeys = meetingEntries.map((entry) => entry[0]);
			const meetingValues = meetingEntries.map((entry) => entry[1]);

			const row = this.db
				.prepare(`INSERT INTO meetings(${meetingKeys.join(', ')}) VALUES (${meetingKeys.map(() => '?').join(', ')})`)
				.run(...meetingValues);
			if (!row.changes) throw new Error('Reunião não foi cadastrada no banco');

			if (Array.isArray(meeting.fieldMinistry)) {
				const fieldMinistryStmt = this.db.prepare(
					'INSERT INTO meetings_field_ministry(meeting_date, student_id, helper_id, title, task_id) VALUES (?, ?, ?, ?, ?)'
				);

				const tasksStmt = this.db.prepare('SELECT id FROM tasks WHERE id = ?');

				for (const fieldMinistry of meeting.fieldMinistry) {
					const { studentId, taskTitle } = fieldMinistry;
					const title = 'title' in fieldMinistry ? fieldMinistry.title : null;
					const helperId = 'helperId' in fieldMinistry ? fieldMinistry.helperId : null;
					fieldMinistryStmt.run(date, studentId, helperId, title, tasksStmt.get(taskTitle));
				}
			}

			if (Array.isArray(meeting.christianLife)) {
				const christianLifeStmt = this.db.prepare(
					'INSERT INTO meetings_christian_life(meeting_date, director_id, title) VALUES (?, ?, ?)'
				);

				for (const { title, directorId } of meeting.christianLife) {
					christianLifeStmt.run(date, directorId, title);
				}
			}

			const overview = this.db.prepare('SELECT * FROM meetings_overview WHERE date_iso = ?').get(date);

			const fieldMinistry = this.db
				.prepare('SELECT * FROM meetings_field_ministry_overview WHERE meeting_date = ?')
				.all(date);
			const christianLife = this.db
				.prepare('SELECT * FROM meetings_christian_life_overview WHERE meeting_date = ?')
				.all(date);

			return {
				overview: overview as MeetingRow,
				fieldMinistry: fieldMinistry as FieldMinistryRow[],
				christianLife: christianLife as ChristianLifeRow[],
			};
		});
		const { overview, christianLife, fieldMinistry } = meetingOverviewTransaction();

		return {
			date: overview.date_iso,
			chairmanId: overview.chairman_id,
			chairmanName: overview.chairman_name,
			treasuresTitle: overview.treasures_title,
			treasuresTalkerId: overview.treasures_talker_id,
			treasuresTalkerName: overview.treasures_talker_name,
			spiritualGemsDirectorId: overview.spiritual_gems_director_id,
			spiritualGemsDirectorName: overview.spiritual_gems_director_name,
			bookStudyDirectorId: overview.book_study_director_id,
			bookStudyDirectorName: overview.book_study_director_name,
			bookStudyReaderId: overview.book_study_reader_id,
			bookStudyReaderName: overview.book_study_reader_name,
			fieldMinistry: fieldMinistry.map(({ id, title, student_id, helper_id, student_name, helper_name }) => ({
				id,
				title,
				studentId: student_id,
				studentName: student_name,
				helperId: helper_id,
				helperName: helper_name,
			})),
			christianLife: christianLife.map(({ id, title, director_id, director_name }) => ({
				id,
				directorId: director_id,
				title,
				directorName: director_name,
			})),
		};
	}
}
