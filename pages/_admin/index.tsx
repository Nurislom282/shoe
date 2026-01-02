import React, { useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../libs/components/layout/LayoutAdmin';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import Chart from 'chart.js/auto';
import { Users, HouseLine, Newspaper, ChatsTeardrop } from 'phosphor-react';


const AdminHome: NextPage = (props: any) => {
	const lineChartRef = useRef<HTMLCanvasElement>(null);
	const doughnutChartRef = useRef<HTMLCanvasElement>(null);

	/** LIFECYCLES **/
	useEffect(() => {
		// Line Chart
		const lineCtx = lineChartRef.current?.getContext('2d');
		let lineChart: Chart | null = null;
		if (lineCtx) {
			lineChart = new Chart(lineCtx, {
				type: 'line',
				data: {
					labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
					datasets: [
						{
							label: 'New Users',
							data: [12, 19, 3, 5, 2, 3, 15],
							borderColor: '#2563eb',
							backgroundColor: 'rgba(37, 99, 235, 0.1)',
							tension: 0.4,
							fill: true,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: 'top',
						},
					},
					maintainAspectRatio: false,
				},
			});
		}

		// Doughnut Chart
		const doughnutCtx = doughnutChartRef.current?.getContext('2d');
		let doughnutChart: Chart | null = null;
		if (doughnutCtx) {
			doughnutChart = new Chart(doughnutCtx, {
				type: 'doughnut',
				data: {
					labels: ['Apartment', 'Villa', 'Farmhouse', 'Hotel'],
					datasets: [
						{
							label: 'Products',
							data: [12, 19, 3, 5],
							backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
							hoverOffset: 4,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: 'bottom',
						},
					},
					maintainAspectRatio: false,
				},
			});
		}

		return () => {
			if (lineChart) lineChart.destroy();
			if (doughnutChart) doughnutChart.destroy();
		};
	}, []);

	const stats = [
		{ title: 'Total Users', value: '1,250', icon: <Users size={32} color="#2563eb" />, bg: '#eff6ff' },
		{ title: 'Total Products', value: '450', icon: <HouseLine size={32} color="#10b981" />, bg: '#ecfdf5' },
		{ title: 'Total Articles', value: '89', icon: <Newspaper size={32} color="#f59e0b" />, bg: '#fffbeb' },
		{ title: 'Active Inquiries', value: '12', icon: <ChatsTeardrop size={32} color="#ef4444" />, bg: '#fef2f2' },
	];

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'} sx={{ mb: 4 }}>
				<Typography variant={'h2'}>Admin Overview</Typography>
			</Box>

			{/* Stat Cards */}
			<Grid container spacing={3} sx={{ mb: 4 }}>
				{stats.map((stat, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								borderRadius: '16px',
								border: '1px solid #e2e8f0',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								bgcolor: '#fff',
							}}
						>
							<Box>
								<Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
									{stat.title}
								</Typography>
								<Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
									{stat.value}
								</Typography>
							</Box>
							<Box
								sx={{
									p: 1.5,
									borderRadius: '12px',
									bgcolor: stat.bg,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								{stat.icon}
							</Box>
						</Paper>
					</Grid>
				))}
			</Grid>

			{/* Charts Section */}
			<Grid container spacing={3}>
				<Grid item xs={12} lg={8}>
					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: '16px',
							border: '1px solid #e2e8f0',
							height: '400px',
						}}
					>
						<Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
							User Registration Trends
						</Typography>
						<Box sx={{ height: '300px', width: '100%', position: 'relative' }}>
							<canvas ref={lineChartRef} />
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12} lg={4}>
					<Paper
						elevation={0}
						sx={{
							p: 3,
							borderRadius: '16px',
							border: '1px solid #e2e8f0',
							height: '400px',
						}}
					>
						<Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
							Product Distribution
						</Typography>
						<Box sx={{ height: '300px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center' }}>
							<canvas ref={doughnutChartRef} />
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

export default withAdminLayout(AdminHome);
