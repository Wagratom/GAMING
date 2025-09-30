import rank1 from '../../assets/rankLevel/rank1.png';
import rank2 from '../../assets/rankLevel/rank2.png';
import rank3 from '../../assets/rankLevel/rank3.png';
import rank4 from '../../assets/rankLevel/rank4.png';
import rank5 from '../../assets/rankLevel/rank5.png';
import rank6 from '../../assets/rankLevel/rank6.png';

export type RankFormating = {
	rank: string;
	borderImg: string;
}

export const RankMappings = [
	{ max: 5, rank: rank1, borderImg: 'borderDivFotoRank1' },
	{ max: 10, rank: rank2, borderImg: 'borderDivFotoRank2' },
	{ max: 15, rank: rank3, borderImg: 'borderDivFotoRank3' },
	{ max: 30, rank: rank4, borderImg: 'borderDivFotoRank4' },
	{ max: 35, rank: rank5, borderImg: 'borderDivFotoRank5' },
	{ max: Infinity, rank: rank6, borderImg: 'borderDivFotoRank6' },
];

export default function HandleRank(pointers: number): RankFormating {
	return RankMappings.find((item) => pointers <= item.max) ||
		RankMappings[RankMappings.length - 1];
};
